export interface Withdraw {
  _id: string;
  amount: number;
  message: string;
  priority: string;
  requestedAt: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  laundryId?: laundary;
}
export interface laundary {
  address: string;
  email: string;
  name: string;
  orders: string;
  profile_image: string;
}
