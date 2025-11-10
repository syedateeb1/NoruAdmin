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

export async function GetUser() {
  const response = await axiosClient.get("/users");
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

export const addUserToGroup = async (id: string, data: string[]) => {
  try {
    const payload = { add_members: data };
    const response = await axiosClient.patch(`/chatrooms/${id}`, payload, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // ✅ override JSON header
      //   },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
export const removeUserFromGroup = async (id: string, data: string[]) => {
  try {
    const payload = { remove_members: data };
    const response = await axiosClient.patch(`/chatrooms/${id}`, payload, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // ✅ override JSON header
      //   },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const updateGroupInfo = async (
  id: string,
  payload: { name: string; group_image: string },
) => {
  try {
    const response = await axiosClient.patch(`/chatrooms/${id}`, payload, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // ✅ override JSON header
      //   },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
