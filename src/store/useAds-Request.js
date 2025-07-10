import { create } from "zustand";
import advertiseService from "../api/ads-request";

const useAdsRequestStore = create((set, get) => ({
  // State
  adRequests: [],
  stats: {
    total: 0,
    accepted: 0,
    waiting: 0,
    rejected: 0,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch advertisement requests
  fetchAdRequests: async (page = 1, sortBy = "status") => {
    try {
      set({ loading: true, error: null });
      const response = await advertiseService.getAdvertisementRequests({
        page,
        sortBy,
      });

      if (response.success) {
        set({
          adRequests: response.data.adRequests,
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
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  // Fetch status counts
  fetchStatusCounts: async () => {
    try {
      const response = await advertiseService.getStatusCounts();

      if (response.success) {
        const { in_progress, waiting, accepted, rejected } = response.data;
        set({
          stats: {
            total: in_progress + waiting + accepted + rejected,
            accepted,
            waiting,
            rejected,
            _force: Math.random(), // يجبر React/Zustand على إعادة الرسم دائماً
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch status counts:", error);
    }
  },

  // Refresh data (both requests and stats)
  refreshData: async (page, sortBy = "status") => {
    const currentPage = page || get().pagination.page;
    await Promise.all([
      get().fetchAdRequests(currentPage, sortBy),
      get().fetchStatusCounts(),
    ]);
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    try {
      set({ loading: true });
      // Optimistic update
      const updatedRequests = get().adRequests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      );
      set({ adRequests: updatedRequests });

      // Call API to update status
      const response = await advertiseService.updateRequestStatus(
        requestId,
        status
      );

      if (response.success) {
        await get().fetchAdRequests(get().pagination.page, "status");
        await get().fetchStatusCounts(); // استدعيها بعد جلب البيانات
        set({ loading: false });
        return { success: true };
      } else {
        await get().fetchAdRequests(get().pagination.page, "status");
        set({ loading: false });
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      await get().fetchAdRequests(get().pagination.page, "status");
      set({ loading: false });
      throw error;
    }
  },

  // Delete request
  deleteRequest: async (requestId) => {
    try {
      set({ loading: true, error: null });
      const response = await advertiseService.deleteRequest(requestId);
      if (response.success) {
        await get().fetchAdRequests(get().pagination.page, "status");
        await get().fetchStatusCounts(); // استدعيها بعد جلب البيانات
        set({ loading: false });
        return { success: true };
      } else {
        set({ error: response.message || "Failed to delete", loading: false });
        throw new Error(response.message || "Failed to delete");
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      adRequests: [],
      stats: {
        total: 0,
        accepted: 0,
        waiting: 0,
        rejected: 0,
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

export default useAdsRequestStore;
