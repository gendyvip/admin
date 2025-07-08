import axios from "axios";

// Create axios instance with base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
authAPI.interceptors.request.use(
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
authAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await authAPI.post("/auth/login", credentials);

      // Check if response is successful
      if (response.data.success && response.data.status === 200) {
        const { token, id, role } = response.data.data;

        // Check if user is admin
        if (role !== "admin") {
          throw new Error("Access denied. Admin role required.");
        }

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id,
            role,
            fullName: response.data.data.fullName,
            email: credentials.email,
          })
        );

        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message || "Server error occurred";
        throw new Error(errorMessage);
      } else if (error.request) {
        // Server not responding
        throw new Error("Server is not responding. Please try again later.");
      } else {
        // Other errors (like role validation)
        throw error;
      }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },

  // Check token validity (optional)
  checkTokenValidity: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Basic JWT token validation (check if expired)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        // Token expired
        authService.logout();
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token
      authService.logout();
      return false;
    }
  },
};

export default authService;
