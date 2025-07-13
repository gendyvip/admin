import { create } from "zustand";
import contactUsService from "../api/contact-us";

const useContactUsStore = create((set, get) => ({
  // State
  requests: [],
  stats: {
    total: 0,
    opened: 0,
    pending: 0,
    closed: 0,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  loading: false,
  error: null,

  // Fetch contact us requests
  fetchContactUsRequests: async (page = 1, search = "") => {
    try {
      set({ loading: true, error: null });
      const response = await contactUsService.getContactUsRequests({
        page,
        search,
      });
      if (response.success) {
        set({
          requests: response.data.messages || [],
          pagination: {
            page,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0,
          },
          loading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch data",
          loading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch status counts from API
  fetchStatusCounts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await contactUsService.getContactUsStatusCounts();
      if (response.success) {
        set({
          stats: {
            ...response.data,
            total:
              (response.data.opened || 0) +
              (response.data.closed || 0) +
              (response.data.waiting || 0),
          },
          loading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch status counts",
          loading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Refresh data (requests + stats)
  refreshData: async (page) => {
    await get().fetchContactUsRequests(page || get().pagination.page);
    await get().fetchStatusCounts();
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      requests: [],
      stats: {
        total: 0,
        opened: 0,
        pending: 0,
        closed: 0,
      },
      pagination: {
        page: 1,
        totalPages: 1,
        total: 0,
      },
      loading: false,
      error: null,
    }),
}));

export default useContactUsStore;
