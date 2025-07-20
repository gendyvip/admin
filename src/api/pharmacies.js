import axiosInstance from "./axios";

export const getAllPharmacies = async (page = 1, search = "") => {
  try {
    let url = `/admin/pharmacies?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch pharmacies"
      );
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export const deletePharmacy = async (pharmacyId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/pharmacies/${pharmacyId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to delete pharmacy"
      );
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export default {
  getAllPharmacies,
  deletePharmacy,
};
