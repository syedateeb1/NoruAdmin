// src/services/authService.ts
import { customerUrl, ridesUrl } from "@/data/constants/apiRoutes";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

export async function customersList(
  query = "",
  type = "",
  page = 1,
): Promise<any[]> {
  console.log(query, type, page, "querycustomersList");
  try {
    const { data } = await axiosClient.get<any[]>(
      customerUrl + "?search=" + query + "&user_type=" + type + "&page=" + page,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching rides:", error?.response?.data);
      throw new Error(error.response?.data?.message || "Failed to fetch rides");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
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
    const response = await axiosClient.patch(`/admin/approve/${id}`, {
      approved: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating driver:", error);
    throw error;
  }
}
