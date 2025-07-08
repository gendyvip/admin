import axios from "axios";

// Create axios instance with base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

const advertiseAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
advertiseAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
advertiseAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const advertiseService = {
  // Get advertisement requests
  getAdvertisementRequests: async ({ page = 1 } = {}) => {
    try {
      const response = await advertiseAPI.get(
        `/advertisement-request?page=${page}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            "Failed to fetch advertisement requests"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
};

export default advertiseService;
