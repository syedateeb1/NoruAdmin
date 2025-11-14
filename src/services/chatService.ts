// src/services/authService.ts
import {
  chatUrl,
  deleteMessageUrl,
  messagesUrl,
} from "@/data/constants/apiRoutes";
import axiosClient from "@/lib/axiosClient";
import { ChatRoom, ChatRoomsResponse } from "@/types/chat";
import axios from "axios";

export async function getChatRooms(query = ""): Promise<ChatRoom[]> {
  try {
    const response = await axiosClient.get<ChatRoomsResponse>(
      chatUrl + "?" + query,
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching rides:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}
export async function getGroups(query = ""): Promise<any[]> {
  try {
    const response = await axiosClient.get<ChatRoomsResponse>(
      chatUrl + "?" + query,
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching rides:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}
export async function getMessages(query = ""): Promise<ChatRoom[]> {
  try {
    const response = await axiosClient.get<ChatRoomsResponse>(
      messagesUrl + "?" + query,
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching rides:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}
export async function deleteChat(query: string): Promise<{
  message: string;
  status: string | number;
  data: any;
}> {
  try {
    const response = await axiosClient.delete(deleteMessageUrl + "?" + query);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || "Failed to fetch rides";
    }
    console.error("Unexpected error:", error);
    return {
      message: "An unexpected error occurred",
      status: "error",
      data: null,
    };
  }
}
export async function sendMessage(formData: FormData) {
  try {
    const response = await axiosClient.post(messagesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data; // 👈 assuming API returns the new message object in `data`
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error sending message:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to send message",
      );
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred while sending message");
  }
}

export async function deleteCustomer(id: string) {
  try {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
}
export async function updateDriver(id: string, status: boolean) {
  try {
    const response = await axiosClient.patch(`/admin/block/${id}`, {
      blocked: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating driver:", error);
    throw error;
  }
}
export async function approveDriver(id: string, status: boolean) {
  try {
    const response = await axiosClient.patch(`/admin/block/${id}`, {
      approved: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating driver:", error);
    throw error;
  }
}
