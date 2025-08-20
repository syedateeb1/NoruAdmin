import axiosClient from "@/lib/axiosClient";

export async function GetOrders() {
  try {
    const response = await axiosClient.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function CreateOrder(data: FormData) {
  try {
    const response = await axiosClient.post("/orders", data);
    return response.data;
  } catch (error) {
    console.error("Error creating orders:", error);
    throw error;
  }
}

export async function DeleteOrder(id: string) {
  try {
    const response = await axiosClient.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
}
