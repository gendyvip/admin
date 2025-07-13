import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const pharmaciesAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token from localStorage
pharmaciesAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllPharmacies = async (page = 1, search = "") => {
  try {
    let url = `/admin/pharmacies?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await pharmaciesAPI.get(url);
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
    const response = await pharmaciesAPI.delete(
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
