import { useMemo, useState } from 'react'
import { Activity, AlertCircle, ArrowDown, ArrowUpRight, Bell, Bot, Check, ChevronDown, CircleHelp, Clock3, Command, Filter, Inbox, LayoutDashboard, LifeBuoy, LogOut, Menu, MessageSquare, MoreHorizontal, Plus, Search, Send, Settings, Sparkles, Ticket as TicketIcon, Users, WandSparkles, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { seedTickets } from './data'
import { isDemoMode, supabase } from './lib/supabase'
import type { Ticket, TicketStatus } from './types'

const chartData = [{day:'Mon',tickets:18},{day:'Tue',tickets:24},{day:'Wed',tickets:21},{day:'Thu',tickets:32},{day:'Fri',tickets:27},{day:'Sat',tickets:19},{day:'Sun',tickets:26}]
const initials = (name:string) => name.split(' ').map(x=>x[0]).join('').slice(0,2)
const badge = (value:string) => value.toLowerCase().replaceAll(' ','-')

export default function App() {
  const [tickets,setTickets] = useState<Ticket[]>(seedTickets)
  const [active,setActive] = useState('Overview')
  const [query,setQuery] = useState('')
  const [statusFilter,setStatusFilter] = useState('All')
  const [selected,setSelected] = useState<Ticket|null>(null)
  const [showNew,setShowNew] = useState(false)
  const [showAssistant,setShowAssistant] = useState(false)
  const [draft,setDraft] = useState('')
  const [newSubject,setNewSubject] = useState('')
  const [newMessage,setNewMessage] = useState('')
  const [notice,setNotice] = useState('')
  const filtered = useMemo(()=>tickets.filter(t=>(active==='Tickets' || active==='Overview') && (statusFilter==='All'||t.status===statusFilter) && `${t.id} ${t.customer} ${t.subject} ${t.category}`.toLowerCase().includes(query.toLowerCase())),[tickets,query,statusFilter,active])
  const openCount=tickets.filter(t=>t.status==='Open').length
  const urgentCount=tickets.filter(t=>t.priority==='Urgent' && t.status!=='Resolved').length

  async function saveTicket(ticket:Ticket) {
    if (!isDemoMode && supabase) {
      const {error}=await supabase.from('tickets').insert({id:ticket.id,customer_name:ticket.customer,customer_email:ticket.email,subject:ticket.subject,message:ticket.message,category:ticket.category,priority:ticket.priority,status:ticket.status,assignee:ticket.assignee,sentiment:ticket.sentiment})
      if(error){setNotice(`Could not save ticket: ${error.message}`);return}
    }
    setTickets(prev=>[ticket,...prev]); setShowNew(false); setNewSubject(''); setNewMessage(''); setNotice('Ticket created successfully')
  }
  async function updateStatus(ticket:Ticket,status:TicketStatus) {
    if (!isDemoMode && supabase) {
      const {error}=await supabase.from('tickets').update({status}).eq('id',ticket.id)
      if(error){setNotice(`Update failed: ${error.message}`);return}
    }
    setTickets(prev=>prev.map(t=>t.id===ticket.id?{...t,status}:t))
    setSelected({...ticket,status}); setNotice('Ticket status updated')
  }
  async function suggestReply() {
    if(!selected)return
    setDraft('Thanks for reaching out. I’m sorry for the inconvenience. I’m checking the details of your request and will follow up with the next steps shortly.')
    setNotice('Demo suggestion generated. Connect an LLM endpoint for live AI responses.')
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><LifeBuoy size={21}/></div><div><b>supportflow</b><small>AI WORKSPACE</small></div></div>
      <div className="workspace"><div className="workspace-icon">S</div><div><b>Studio workspace</b><small>Free plan</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      {([{name:'Overview',icon:LayoutDashboard},{name:'Tickets',icon:Inbox},{name:'Customers',icon:Users},{name:'AI assistant',icon:Bot}] as const).map(item=><button key={item.name} className={`nav-item ${active===item.name?'active':''}`} onClick={()=>{setActive(item.name);setSelected(null)}}><item.icon size={18}/>{item.name}{item.name==='Tickets'&&<span className="nav-count">{tickets.length}</span>}</button>)}
      <div className="nav-label spaced">MANAGE</div>
      <button className="nav-item" onClick={()=>setNotice('Automation settings are part of the integration roadmap.')}><Activity size={18}/>Automations</button>
      <button className="nav-item" onClick={()=>setNotice('Settings page is planned for the next iteration.')}><Settings size={18}/>Settings</button>
      <div className="sidebar-bottom"><div className="avatar purple">MC</div><div className="profile"><b>Maya Chen</b><small>Support manager</small></div><MoreHorizontal size={18}/></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><b>{selected?'Ticket details':active}</b></div><div className="top-actions"><span className="demo-pill"><span/> {isDemoMode?'DEMO DATA':'CONNECTED'}</span><button className="icon-btn" aria-label="Notifications" onClick={()=>setNotice('You are all caught up.')}><Bell size={18}/></button><div className="avatar">MC</div></div></header>
      <div className="content">
        {selected ? <TicketDetail ticket={selected} onClose={()=>setSelected(null)} onStatus={s=>updateStatus(selected,s)} onSuggest={suggestReply} draft={draft} setDraft={setDraft}/> :
        active==='AI assistant' ? <section className="assistant-page"><div className="eyebrow"><Sparkles size={14}/> AI COPILOT</div><h1>How can I help you today?</h1><p className="muted">Ask about ticket trends, draft a response, or summarize a customer issue.</p><div className="assistant-card"><div className="bot-orb"><Bot size={28}/></div><h3>SupportFlow Copilot</h3><p>This starter includes a safe demo assistant experience. Connect an LLM endpoint to enable grounded, live answers.</p><div className="prompt-chips"><button onClick={()=>setDraft('Summarize the urgent tickets and suggest next actions.')}>Summarize urgent tickets</button><button onClick={()=>setDraft('Draft a friendly response to a delayed shipment complaint.')}>Draft a reply</button></div><div className="composer"><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask your support copilot..."/><button className="primary" onClick={()=>setNotice('Demo mode: connect an LLM endpoint to process prompts.')}><Send size={16}/></button></div></div></section> :
        <><div className="page-heading"><div><div className="eyebrow">MONDAY, NOVEMBER 23, 2026 <span className="live-dot"/></div><h1>{active==='Tickets'?'All tickets':'Good morning, Maya'} <span className="wave">✦</span></h1><p className="muted">{active==='Tickets'?'Manage and resolve customer conversations.':'Here’s what’s happening with your support team today.'}</p></div><div className="heading-actions"><button className="secondary" onClick={()=>setShowAssistant(true)}><Sparkles size={16}/> AI insights</button><button className="primary" onClick={()=>setShowNew(true)}><Plus size={17}/> New ticket</button></div></div>
        {active==='Overview'&&<><div className="stats-grid">
          <Stat icon={<Inbox/>} label="Total tickets" value={String(tickets.length+1248)} delta="+12.8%" note="vs. last week" color="blue"/>
          <Stat icon={<Clock3/>} label="Open tickets" value={String(openCount+18)} delta="-4.2%" note="vs. last week" color="orange"/>
          <Stat icon={<Check/>} label="Resolved today" value="38" delta="+8.1%" note="vs. last week" color="green"/>
          <Stat icon={<AlertCircle/>} label="Urgent tickets" value={String(urgentCount)} delta="Needs attention" note="priority queue" color="red"/>
        </div><div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-head"><div><h3>Ticket volume</h3><p>Incoming conversations over the last 7 days</p></div><button className="select-btn">Last 7 days <ChevronDown size={14}/></button></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#98a2b3',fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#98a2b3',fontSize:12}}/><Tooltip cursor={{fill:'#f5f7fb'}}/><Bar dataKey="tickets" fill="#6558e8" radius={[5,5,0,0]} barSize={24}/></BarChart></ResponsiveContainer></div></section><section className="panel insight-panel"><div className="panel-head"><div><h3><Sparkles size={16}/> AI insights</h3><p>Highlights from your inbox</p></div><span className="ai-tag">BETA</span></div><div className="insight"><div className="insight-icon orange-bg"><AlertCircle size={17}/></div><div><b>Shipping issues are trending</b><p>Shipping-related tickets increased 18% this week.</p></div></div><div className="insight"><div className="insight-icon purple-bg"><WandSparkles size={17}/></div><div><b>Response opportunity</b><p>5 tickets may benefit from a proactive update.</p></div></div><button className="text-btn" onClick={()=>setShowAssistant(true)}>Explore AI insights <ArrowUpRight size={15}/></button></section></div></>}
        <section className="panel tickets-panel"><div className="panel-head"><div><h3>{active==='Tickets'?'All tickets':'Recent tickets'}</h3><p>A snapshot of your latest customer conversations</p></div><button className="text-btn" onClick={()=>setActive('Tickets')}>View all <ArrowUpRight size={15}/></button></div><div className="table-tools"><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tickets..."/></div><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option><option>Open</option><option>In progress</option><option>Waiting</option><option>Resolved</option></select><button className="filter-btn" onClick={()=>setStatusFilter('All')}><Filter size={15}/> Clear filters</button></div><div className="table-scroll"><table><thead><tr><th>Ticket</th><th>Customer</th><th>Category</th><th>Priority</th><th>Status</th><th>Assignee</th><th></th></tr></thead><tbody>{filtered.map(t=><tr key={t.id} onClick={()=>setSelected(t)}><td><b className="ticket-id">{t.id}</b><small className="subject">{t.subject}</small></td><td><div className="customer-cell"><div className="avatar tiny">{initials(t.customer)}</div><span>{t.customer}</span></div></td><td><span className="category">{t.category}</span></td><td><span className={`priority ${badge(t.priority)}`}><i/>{t.priority}</span></td><td><span className={`status ${badge(t.status)}`}>{t.status}</span></td><td className="assignee">{t.assignee}</td><td><MoreHorizontal size={17} color="#98a2b3"/></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty">No tickets match your search.</div>}</div></section>
        </>}
      </div>
    </main>
    {showNew&&<div className="overlay" onClick={()=>setShowNew(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Create ticket</h2><p>Add a customer request to the inbox.</p></div><button className="icon-btn" onClick={()=>setShowNew(false)}><X/></button></div><label>Subject<input value={newSubject} onChange={e=>setNewSubject(e.target.value)} placeholder="e.g. Order delivery delay"/></label><label>Customer message<textarea value={newMessage} onChange={e=>setNewMessage(e.target.value)} placeholder="Describe the customer issue..." rows={4}/></label><div className="modal-actions"><button className="secondary" onClick={()=>setShowNew(false)}>Cancel</button><button className="primary" disabled={!newSubject.trim()||!newMessage.trim()} onClick={()=>saveTicket({id:`SF-${2050+tickets.length}`,customer:'New customer',email:'customer@example.com',subject:newSubject,message:newMessage,category:'General',priority:'Medium',status:'Open',assignee:'Unassigned',created_at:new Date().toISOString(),sentiment:'Unclassified'})}><Plus size={16}/> Create ticket</button></div></div></div>}
    {showAssistant&&<div className="overlay" onClick={()=>setShowAssistant(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow"><Sparkles size={13}/> AI INSIGHTS</div><h2>Inbox snapshot</h2></div><button className="icon-btn" onClick={()=>setShowAssistant(false)}><X/></button></div><div className="ai-summary"><b><AlertCircle size={17}/> Priority attention</b><p>{urgentCount} urgent tickets are currently open in this demo inbox. Review billing and shipping complaints first.</p><b><WandSparkles size={17}/> Suggested action</b><p>Send proactive updates to customers whose shipment tracking has not changed.</p></div><button className="primary full" onClick={()=>{setShowAssistant(false);setActive('AI assistant')}}>Open AI copilot <ArrowUpRight size={16}/></button></div></div>}
    {notice&&<div className="toast"><Check size={16}/>{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
  </div>
}

function Stat({icon,label,value,delta,note,color}:{icon:React.ReactNode,label:string,value:string,delta:string,note:string,color:string}) {
 return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${color}`}>{icon}</span><MoreHorizontal size={18} color="#98a2b3"/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot"><span className={color==='red'?'negative':'positive'}>{delta}</span><span>{note}</span></div></div>
}
function TicketDetail({ticket,onClose,onStatus,onSuggest,draft,setDraft}:{ticket:Ticket,onClose:()=>void,onStatus:(s:TicketStatus)=>void,onSuggest:()=>void,draft:string,setDraft:(s:string)=>void}) {
 return <div className="detail-page"><button className="back-btn" onClick={onClose}>← Back to inbox</button><div className="detail-layout"><section className="panel conversation"><div className="detail-title"><div><div className="eyebrow">{ticket.id} · {ticket.category.toUpperCase()}</div><h1>{ticket.subject}</h1><p className="muted">Created {new Date(ticket.created_at).toLocaleString()}</p></div><button className="icon-btn"><MoreHorizontal/></button></div><div className="message-card"><div className="customer-cell"><div className="avatar">{initials(ticket.customer)}</div><div><b>{ticket.customer}</b><small>{ticket.email}</small></div></div><p>{ticket.message}</p></div><div className="reply-box"><div className="reply-head"><b>Reply to customer</b><button className="text-btn" onClick={onSuggest}><Sparkles size={15}/> Suggest with AI</button></div><textarea rows={5} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write your response..."/><div className="reply-foot"><span>AI suggestions should be reviewed before sending.</span><button className="primary" onClick={()=>setDraft('')}><Send size={15}/> Clear draft</button></div></div></section><aside className="panel details-card"><h3>Ticket properties</h3><label>Status<select value={ticket.status} onChange={e=>onStatus(e.target.value as TicketStatus)}><option>Open</option><option>In progress</option><option>Waiting</option><option>Resolved</option></select></label><div className="property"><span>Priority</span><b>{ticket.priority}</b></div><div className="property"><span>Assignee</span><b>{ticket.assignee}</b></div><div className="property"><span>Sentiment</span><b>{ticket.sentiment}</b></div><div className="property"><span>Customer</span><b>{ticket.customer}</b></div><div className="ai-note"><Sparkles size={16}/><b>AI assistance</b><p>Generate a draft reply based on the ticket context. Always review before sending.</p></div></aside></div></div>
}
