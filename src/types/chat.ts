// types.ts
export interface Message {
  id: number;
  name: string;
  message: string;
  time: string;
  sender: boolean;
}

export type Chat = {
  id: string;
  name: string;
  image: string;
  status: "Online" | "Offline";
  messages: Message[];
};

export interface ChatRoomsResponse {
  data: any[]; // or define a proper ChatRoom interface instead of any[]
  message: string;
  status: number;
}

// Define proper interfaces
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image?: string;
  blocked?: boolean;
}

export interface LastMessage {
  sender_name: string;
  text: string;
  media: any[];
  createdAt: string;
}

export interface ChatRoom {
  _id: string;
  members: User[];
  admins: any[];
  is_group: boolean;
  type: string;
  deleted: boolean;
  deleted_by: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: LastMessage;
  unread_count: number;
  last_read?: string;
  blocked_by: any;
  ride_id?: string;
}
