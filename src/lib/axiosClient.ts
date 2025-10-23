// src/lib/axiosClient.ts
import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor: Inject Authorization token
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response Interceptor: Handle Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        // Remove token
        localStorage.removeItem("auth_token");

        // Optional: Show toast message
        toast.error("Session expired. Please log in again.");

        // Redirect to login if not already there
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
