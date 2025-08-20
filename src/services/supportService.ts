import axiosClient from "@/lib/axiosClient";

export async function GetSupport() {
  try {
    const response = await axiosClient.get("/support");
    return response.data;
  } catch (error) {
    console.error("Error fetching support:", error);
    throw error;
  }
}
export async function CreateSupport(data: FormData) {
  try {
    const response = await axiosClient.post("/support", data, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ override JSON header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating support:", error);
    throw error;
  }
}
