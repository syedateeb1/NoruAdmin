// src/services/authService.ts
import { ridesUrl } from "@/data/constants/apiRoutes";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

export async function fetchRides({ query = "", page = 1 }): Promise<any[]> {
  try {
    const { data } = await axiosClient.get<any[]>(
      ridesUrl + "?search=" + query + "&page=" + page,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching rides:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}

export const makePayment = async (data: any) => {
  try {
    const response = await axiosClient.post("/payments", data);
    return response.data;
  } catch (error) {
    console.error("Error creating orders:", error);
    throw error;
  }
};
