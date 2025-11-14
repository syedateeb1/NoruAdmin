// src/services/authService.ts
import {
  delUrl,
  loginUrl,
  overviewDashboardUrl,
} from "@/data/constants/apiRoutes";
import axiosClient from "@/lib/axiosClient";

export interface LoginData {
  email: string;
  password: string;
  user_type?: string;
}

export async function loginUser(data: LoginData) {
  const response = await axiosClient.post(loginUrl, data); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}
export async function deleteUser(data: LoginData) {
  const response = await axiosClient.post(delUrl, data); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}

export async function registerUser(data: LoginData) {
  const response = await axiosClient.post("/auth/register", data); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}

export async function logoutUser() {
  const response = await axiosClient.post("/auth/logout"); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}

export async function fetchUserProfile() {
  const response = await axiosClient.get("/me"); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}
export async function fetchOverviewDashboardUrl() {
  const response = await axiosClient.get(overviewDashboardUrl); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}

export async function updateProfile(data: any) {
  const response = await axiosClient.put("/me", data); // Adjust URL as per your backend
  return response.data; // { token, ...etc }
}
