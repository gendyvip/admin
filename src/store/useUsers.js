import { create } from "zustand";
import usersService from "../api/users";

const useUsersStore = create((set, get) => ({
  // State
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  },
  search: "",
  roleFilter: "",
  statusFilter: "",
  stats: {
    total: 0,
    admin: 0,
    pharmacist: 0,
    user: 0,
    verified: 0,
    unverified: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch all users
  fetchUsers: async ({
    page = 1,
    search = "",
    role = "",
    status = "",
  } = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await usersService.getAllUsers({
        page,
        search,
        role,
        status,
      });

      if (response.message === "success") {
        const users = response.data.users || [];

        set({
          users,
          pagination: {
            page: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0,
            count: response.data.count || 0,
          },
          search,
          roleFilter: role,
          statusFilter: status,
          loading: false,
        });

        // Calculate stats from users data
        const stats = {
          total: response.data.total || users.length,
          admin: users.filter((u) => u.role === "admin").length,
          pharmacist: users.filter((u) => u.role === "pharmacist").length,
          user: users.filter((u) => u.role === "user").length,
          verified: users.filter((u) => u.adminVerification && u.isIdVerified)
            .length,
          unverified: users.filter(
            (u) => !u.adminVerification || !u.isIdVerified
          ).length,
        };
        set({ stats });
      } else {
        set({
          error: response.message || "Failed to fetch users",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  // Fetch user statistics
  fetchUserStats: async () => {
    try {
      const response = await usersService.getUserStats();

      if (response.message === "success") {
        set({
          stats: {
            total: response.data.total || 0,
            admin: response.data.admin || 0,
            pharmacist: response.data.pharmacist || 0,
            user: response.data.user || 0,
            verified: response.data.verified || 0,
            unverified: response.data.unverified || 0,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch user statistics:", error);
      // Calculate stats from current users data as fallback
      const { users } = get();
      const stats = {
        total: users.length,
        admin: users.filter((u) => u.role === "admin").length,
        pharmacist: users.filter((u) => u.role === "pharmacist").length,
        user: users.filter((u) => u.role === "user").length,
        verified: users.filter((u) => u.adminVerification && u.isIdVerified)
          .length,
        unverified: users.filter((u) => !u.adminVerification || !u.isIdVerified)
          .length,
      };
      set({ stats });
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await usersService.getUserById(userId);
      set({ loading: false });
      return response;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset filters
  resetFilters: () => {
    set({
      search: "",
      roleFilter: "",
      statusFilter: "",
    });
  },

  // Get filtered users count
  getFilteredUsersCount: () => {
    const { users } = get();
    return users.length;
  },

  // Get users by role
  getUsersByRole: (role) => {
    const { users } = get();
    return users.filter((user) => user.role === role);
  },

  // Get verified users
  getVerifiedUsers: () => {
    const { users } = get();
    return users.filter((user) => user.isIdVerified && user.adminVerification);
  },

  // Get unverified users
  getUnverifiedUsers: () => {
    const { users } = get();
    return users.filter(
      (user) => !user.isIdVerified || !user.adminVerification
    );
  },

  // Confirm user
  confirmUser: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await usersService.confirmUser(userId);

      if (response.message === "success") {
        // Update the user in the current list
        const { users } = get();
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, adminVerification: true } : user
        );

        set({
          users: updatedUsers,
          loading: false,
        });

        // Refresh stats
        get().fetchUserStats();

        return response;
      } else {
        set({
          error: response.message || "Failed to confirm user",
          loading: false,
        });
        throw new Error(response.message || "Failed to confirm user");
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Block user
  blockUser: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await usersService.blockUser(userId);

      if (response.message === "success") {
        // Update the user in the current list
        const { users } = get();
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, adminVerification: false } : user
        );

        set({
          users: updatedUsers,
          loading: false,
        });

        // Refresh stats
        get().fetchUserStats();

        return response;
      } else {
        set({
          error: response.message || "Failed to block user",
          loading: false,
        });
        throw new Error(response.message || "Failed to block user");
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useUsersStore;
