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
  getAllAds: async ({
    page = 1,
    search = "",
    status = "",
    targetPosition = "",
  } = {}) => {
    try {
      let url = `/advertisement?page=${page}`;

      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (status && status.trim() !== "") {
        url += `&status=${encodeURIComponent(status)}`;
      }

      if (targetPosition && targetPosition.trim() !== "") {
        url += `&targetPosition=${encodeURIComponent(targetPosition)}`;
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
      // Handle targetPosition as array if it's an array
      const dataToSend = { ...adData };
      if (Array.isArray(dataToSend.targetPosition)) {
        dataToSend.targetPosition = dataToSend.targetPosition;
      }

      // Log the data being sent
      console.log("Data being sent to createAd:", dataToSend);

      const response = await adsCreationAPI.post("/advertisement", dataToSend);
      return response.data;
    } catch (error) {
      console.error("Error in createAd:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          JSON.stringify(error.response.data) ||
          "Failed to create advertisement";
        throw new Error(
          `Server Error (${error.response.status}): ${errorMessage}`
        );
      } else if (error.request) {
        throw new Error("Server is not responding. Please try again later.");
      } else {
        throw error;
      }
    }
  },

  // Create new advertisement for a specific request (with image upload)
  createAdWithRequestId: async (requestId, adData) => {
    try {
      const formData = new FormData();
      for (const key in adData) {
        if (adData[key] !== undefined && adData[key] !== null) {
          if (key === "image" && adData[key] instanceof File) {
            formData.append("image", adData[key]);
          } else if (key === "targetPosition" && Array.isArray(adData[key])) {
            // Handle targetPosition as array - send only values
            adData[key].forEach((position, index) => {
              formData.append(`targetPosition[${index}]`, position);
            });
          } else {
            formData.append(key, adData[key]);
          }
        }
      }

      // Log the FormData for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await adsCreationAPI.post(
        `/advertisement/${requestId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating advertisement:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          JSON.stringify(error.response.data) ||
          "Failed to create advertisement";

        // Create a more specific error message
        let finalErrorMessage = `Server Error (${error.response.status}): ${errorMessage}`;

        // Handle specific error cases
        if (
          error.response.status === 400 &&
          errorMessage.includes("already exists")
        ) {
          finalErrorMessage =
            "An advertisement already exists for this request. Please check the advertisements list.";
        }

        throw new Error(finalErrorMessage);
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

  // Update advertisement status (active/inactive)
  updateAdStatus: async (adId, status, extra = {}) => {
    try {
      const updateData = {
        status: String(status),
        ...extra,
      };

      // Handle targetPosition as array if it's provided
      if (extra.targetPosition && Array.isArray(extra.targetPosition)) {
        updateData.targetPosition = extra.targetPosition;
      }

      // Log the update data
      console.log("Update data being sent:", updateData);
      console.log("Ad ID:", adId);

      const response = await adsCreationAPI.patch(
        `/advertisement/${adId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateAdStatus:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          JSON.stringify(error.response.data) ||
          "Failed to update advertisement status";
        throw new Error(
          `Server Error (${error.response.status}): ${errorMessage}`
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
