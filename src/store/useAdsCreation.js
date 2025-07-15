import { create } from "zustand";
import adsCreationService from "../api/ads-creation";

const useAdsCreationStore = create((set, get) => ({
  // State
  ads: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  },
  search: "",
  statusFilter: "",
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch all advertisements
  fetchAds: async ({
    page = 1,
    search = "",
    status = "",
    targetPosition = "",
  } = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await adsCreationService.getAllAds({
        page,
        search,
        status,
        targetPosition,
      });

      if (response.success) {
        const ads = response.data.ads || [];
        set({
          ads,
          pagination: {
            page: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0,
            count: response.data.count || 0,
          },
          search,
          statusFilter: status,
          loading: false,
        });

        // Calculate stats from ads data
        const stats = {
          total: response.data.total || ads.length,
          active: ads.filter((ad) => ad.status === true).length,
          inactive: ads.filter((ad) => ad.status === false).length,
        };
        set({ stats });
      } else {
        set({
          error: response.message || "Failed to fetch advertisements",
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

  // Fetch advertisement statistics
  fetchAdStats: async () => {
    try {
      const response = await adsCreationService.getAdStats();

      if (response.success) {
        set({
          stats: {
            total: response.data.total || 0,
            active: response.data.active || 0,
            inactive: response.data.inactive || 0,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch advertisement statistics:", error);
      // Calculate stats from current ads data as fallback
      const { ads } = get();
      const stats = {
        total: ads.length,
        active: ads.filter((ad) => ad.status === true).length,
        inactive: ads.filter((ad) => ad.status === false).length,
      };
      set({ stats });
    }
  },

  // Create new advertisement
  createAd: async (adData) => {
    try {
      set({ loading: true, error: null });
      const response = await adsCreationService.createAd(adData);

      if (response.success) {
        // Refresh the ads list
        const { pagination, search, statusFilter } = get();
        await get().fetchAds({
          page: pagination.page,
          search,
          status: statusFilter,
        });

        set({ loading: false });
        return response;
      } else {
        set({
          error: response.message || "Failed to create advertisement",
          loading: false,
        });
        throw new Error(response.message || "Failed to create advertisement");
      }
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
      statusFilter: "",
    });
  },

  // Get filtered ads count
  getFilteredAdsCount: () => {
    const { ads } = get();
    return ads.length;
  },

  // Get active ads
  getActiveAds: () => {
    const { ads } = get();
    return ads.filter((ad) => ad.status === true);
  },

  // Get inactive ads
  getInactiveAds: () => {
    const { ads } = get();
    return ads.filter((ad) => ad.status === false);
  },
}));

export default useAdsCreationStore;
