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
  fetchContactUsRequests: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      const response = await contactUsService.getContactUsRequests({ page });
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

  // Fetch status counts (if API supports it)
  fetchStatusCounts: async () => {
    // يمكنك تعديلها لاحقاً إذا كان هناك endpoint خاص بالإحصائيات
    // حالياً سنحسبها من البيانات الموجودة
    const requests = get().requests;
    const stats = {
      total: requests.length,
      opened: requests.filter((r) => r.status.toLowerCase() === "opened")
        .length,
      pending: requests.filter((r) => r.status.toLowerCase() === "pending")
        .length,
      closed: requests.filter((r) => r.status.toLowerCase() === "closed")
        .length,
    };
    set({ stats });
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
