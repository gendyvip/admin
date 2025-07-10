import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const dealsAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token from localStorage
// (assumes token is stored in localStorage)
dealsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllDeals = async (page = 1, search = "") => {
  try {
    let url = `/admin/deals?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await dealsAPI.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch deals");
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export const deleteDeal = async (dealId) => {
  try {
    const response = await dealsAPI.delete(`/admin/deals/${dealId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to delete deal");
    } else if (error.request) {
      throw new Error("Server is not responding. Please try again later.");
    } else {
      throw error;
    }
  }
};

export default {
  getAllDeals,
  deleteDeal,
};
