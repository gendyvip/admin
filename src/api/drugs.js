import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const drugsAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
// (assumes token is stored in localStorage)
drugsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllDrugs = async (page = 1, search = "") => {
  try {
    let url = `/drug-details?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await drugsAPI.get(url);
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

export default {
  getAllDrugs,
};
