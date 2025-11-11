import axiosClient from "@/lib/axiosClient";

export interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  lat: string;
  lng: string;
  profile_image: any;
}

export async function CreateUser(data: FormData) {
  const response = await axiosClient.post("/users", data);
  return response.data;
}

export async function GetUser(page = 1, limit = 20) {
  const response = await axiosClient.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
}

export async function DeleteUser(id: string) {
  try {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
}

export const UpdateUser = async (id: string, data: FormData) => {
  try {
    const response = await axiosClient.patch(`/users`, data, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ override JSON header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
