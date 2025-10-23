// src/services/settingsService.ts
import {
  radiusGetUrl,
  radiusSetUrl,
  settingUrl,
} from "@/data/constants/apiRoutes";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

/**
 * 🔹 Unified settings handler
 * - If `formData` is provided → POST (update settings)
 * - If no `formData` → GET (fetch settings)
 */
export async function settings(formData?: FormData): Promise<any> {
  try {
    let response;

    if (formData) {
      // ✅ Update settings (POST)
      response = await axiosClient.post(settingUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // ✅ Get settings (GET)
      response = await axiosClient.get(settingUrl);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error (settings):", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Settings request failed",
      );
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}

export async function setRadiusService(radius?: {
  radius: string;
}): Promise<any> {
  try {
    let response;

    if (radius) {
      // ✅ Update settings (POST)
      response = await axiosClient.patch(radiusSetUrl, radius);
    } else {
      // ✅ Get settings (GET)
      response = await axiosClient.get(radiusGetUrl);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error (settings):", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Settings request failed",
      );
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
}
