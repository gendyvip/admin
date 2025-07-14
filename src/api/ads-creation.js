import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const adsCreationAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
adsCreationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
adsCreationAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const adsCreationService = {
  // Get all advertisements with pagination
  getAllAds: async ({ page = 1, search = "", status = "" } = {}) => {
    try {
      let url = `/advertisement?page=${page}`;

      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (status && status.trim() !== "") {
        url += `&status=${encodeURIComponent(status)}`;
      }

      const response = await adsCreationAPI.get(url);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch advertisements"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Create new advertisement
  createAd: async (adData) => {
    try {
      const response = await adsCreationAPI.post("/advertisement", adData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to create advertisement"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Get advertisement statistics
  getAdStats: async () => {
    try {
      const response = await adsCreationAPI.get("/advertisement/stats");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            "Failed to fetch advertisement statistics"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
};

export default adsCreationService;
