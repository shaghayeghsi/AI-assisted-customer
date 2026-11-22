export type TicketStatus = 'Open' | 'In progress' | 'Waiting' | 'Resolved'
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low'
export type Ticket = {
  id: string; customer: string; email: string; subject: string; message: string
  category: string; priority: Priority; status: TicketStatus; assignee: string
  created_at: string; sentiment: string
}
