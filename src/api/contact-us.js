import axiosInstance from "./axios";

export const contactUsService = {
  getContactUsRequests: async ({ page = 1, search = "" } = {}) => {
    try {
      let url = `/contact-us?page=${page}`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await axiosInstance.get(url);
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
      const response = await axiosInstance.patch(`/contact-us/${id}/status`, {
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
      const response = await axiosInstance.get("/contact-us/status-counts");
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
      const response = await axiosInstance.delete(`/contact-us/${id}`);
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
