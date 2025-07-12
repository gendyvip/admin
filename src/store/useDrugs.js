import { create } from "zustand";
import drugsAPI from "../api/drugs";

const useDrugsStore = create((set, get) => ({
  drugs: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    count: 0,
    page: 1,
    size: 10,
    totalPages: 1,
  },
  search: "",

  fetchAllDrugs: async (page = 1, search = "") => {
    set({ loading: true, error: null });
    try {
      const response = await drugsAPI.getAllDrugs(page, search);
      set({
        drugs: response.data.drugs || [],
        pagination: {
          total: response.data.total || 0,
          count: response.data.count || 0,
          page: response.data.page || 1,
          size: response.data.size || 10,
          totalPages: response.data.totalPages || 1,
        },
        search,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteDrug: async (drugId) => {
    set({ loading: true, error: null });
    try {
      await drugsAPI.deleteDrug(drugId);
      set((state) => ({
        drugs: state.drugs.filter((d) => d.id !== drugId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addDrug: async (drugData) => {
    set({ loading: true, error: null });
    try {
      const response = await drugsAPI.addDrug(drugData);
      set((state) => ({
        drugs: [response.data, ...state.drugs],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useDrugsStore;
