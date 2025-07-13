import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const contactUsAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
contactUsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("TOKEN SENT IN HEADER:", token); // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
contactUsAPI.interceptors.response.use(
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

export const contactUsService = {
  getContactUsRequests: async ({ page = 1, search = "" } = {}) => {
    try {
      let url = `/contact-us?page=${page}`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await contactUsAPI.get(url);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch contact us requests"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
  // Add updateContactUsStatus
  updateContactUsStatus: async (id, status) => {
    try {
      const response = await contactUsAPI.patch(`/contact-us/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to update status"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
  // Add getContactUsStatusCounts
  getContactUsStatusCounts: async () => {
    try {
      const response = await contactUsAPI.get("/contact-us/status-counts");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch status counts"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
  // Add deleteContactUsRequest
  deleteContactUsRequest: async (id) => {
    try {
      const response = await contactUsAPI.delete(`/contact-us/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to delete contact us request"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
};

export default contactUsService;
