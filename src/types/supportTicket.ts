export interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  priority: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
}
export interface TicketReply {
  sender: "admin" | "user";
  message: string;
  timestamp: string;
}
