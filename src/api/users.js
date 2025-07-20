import axiosInstance from "./axios";

export const usersService = {
  // Get all users with pagination and search
  getAllUsers: async ({
    page = 1,
    search = "",
    role = "",
    status = "",
  } = {}) => {
    try {
      let url = `/user?page=${page}`;

      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (role && role.trim() !== "") {
        url += `&role=${encodeURIComponent(role)}`;
      }

      if (status && status.trim() !== "") {
        // Map frontend status values to backend values
        let backendStatus = status;
        if (status === "verified") {
          backendStatus = "verified";
        } else if (status === "ai_verified") {
          backendStatus = "ai_verified";
        } else if (status === "blocked") {
          backendStatus = "blocked";
        } else if (status === "unverified") {
          backendStatus = "unverified";
        }
        url += `&status=${encodeURIComponent(backendStatus)}`;
      }

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch users"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || "Failed to fetch user");
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get("/user/stats");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch user statistics"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Confirm user
  confirmUser: async (userId) => {
    try {
      const response = await axiosInstance.patch(`/user/${userId}/confirmed`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to confirm user"
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Block user
  blockUser: async (userId) => {
    try {
      const response = await axiosInstance.patch(`/user/${userId}/blocked`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || "Failed to block user");
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },
};

export default usersService;
