import axiosInstance from "./axios";

export const advertiseService = {
  // Get advertisement requests
  getAdvertisementRequests: async ({
    page = 1,
    sortBy = "status",
    search = "",
  } = {}) => {
    try {
      const response = await axiosInstance.get(
        `/advertisement-request?page=${page}&sortBy=${sortBy}${
          search ? `&search=${search}` : ""
        }`
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

  // Get status counts
  getStatusCounts: async () => {
    try {
      const response = await axiosInstance.get(
        `/advertisement-request/status-counts`
      );
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

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await axiosInstance.patch(
        `/advertisement-request/${requestId}`,
        {
          status: status,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to update request status"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Delete advertisement request
  deleteRequest: async (requestId) => {
    try {
      const response = await axiosInstance.delete(
        `/advertisement-request/${requestId}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            "Failed to delete advertisement request"
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
