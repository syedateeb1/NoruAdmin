import axiosClient from "@/lib/axiosClient";

export async function GetWithdraw() {
  try {
    const response = await axiosClient.get("/withdraw");
    return response.data;
  } catch (error) {
    console.error("Error fetching Withdraw:", error);
    throw error;
  }
}
export async function CreateWithdraw(data: FormData) {
  try {
    const response = await axiosClient.post("/withdraw", data, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ override JSON header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Withdraw:", error);
    throw error;
  }
}

export async function UpdateWithdraw(data: any) {
  try {
    const response = await axiosClient.patch("/withdraw", data);
    return response.data;
  } catch (error) {
    console.error("Error creating Withdraw:", error);
    throw error;
  }
}
