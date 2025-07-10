import { create } from "zustand";
import dealsAPI from "../api/deals";

const useDealsStore = create((set) => ({
  deals: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    size: 10,
  },
  search: "",

  fetchDeals: async (page = 1, search = "") => {
    set({ loading: true, error: null });
    try {
      const data = await dealsAPI.getAllDeals(page, search);
      set({
        deals: data.data.deals,
        pagination: {
          page: data.data.page,
          totalPages: data.data.totalPages,
          total: data.data.total,
          size: data.data.size,
        },
        search,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteDeal: async (dealId) => {
    set({ loading: true, error: null });
    try {
      await dealsAPI.deleteDeal(dealId);
      set((state) => ({
        deals: state.deals.filter((d) => d.id !== dealId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useDealsStore;
