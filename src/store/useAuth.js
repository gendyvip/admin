import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../api/auth";

export const useAuth = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          try {
            const userData = JSON.parse(user);

            // Check if token is still valid
            if (authService.checkTokenValidity()) {
              set({
                user: userData,
                token,
                isAuthenticated: true,
                error: null,
              });
            } else {
              // Token expired or invalid
              authService.logout();
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
              });
            }
          } catch (error) {
            // Invalid user data, clear everything
            authService.logout();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          // Update state with user data
          const userData = {
            id: response.data.id,
            role: response.data.role,
            fullName: response.data.fullName,
            email: credentials.email,
          };

          set({
            user: userData,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },

      // Get user info
      getUser: () => {
        return get().user;
      },

      // Get token
      getToken: () => {
        return get().token;
      },

      // Check authentication status
      checkAuth: () => {
        return get().isAuthenticated;
      },

      // Update user data
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
