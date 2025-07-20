import axiosInstance from "./axios";

export const getAllDrugs = async (page = 1, search = "") => {
  try {
    let url = `/drug-details?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch drugs");
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export const deleteDrug = async (drugId) => {
  try {
    const response = await axiosInstance.delete(`/drug-details/${drugId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to delete drug");
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export const addDrug = async (drugData) => {
  try {
    const response = await axiosInstance.post("/drug-details", drugData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to add drug");
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export default {
  getAllDrugs,
  deleteDrug,
  addDrug,
};
