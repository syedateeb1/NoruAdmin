import axiosClient from "@/lib/axiosClient";

export async function GetCategories() {
  try {
    const response = await axiosClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function CreateCategory(data: FormData) {
  try {
    const response = await axiosClient.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ override JSON header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function DeleteCategory(id: string) {
  try {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
export const UpdateCategory = async (id: string, data: FormData) => {
  try {
    const response = await axiosClient.patch(`/categories/${id}`, data, {
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
