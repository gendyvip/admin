import { create } from "zustand";
import pharmaciesAPI from "../api/pharmacies";

const usePharmaciesStore = create((set) => ({
  pharmacies: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    size: 10,
  },
  search: "",

  fetchPharmacies: async (page = 1, search = "") => {
    set({ loading: true, error: null });
    try {
      const data = await pharmaciesAPI.getAllPharmacies(page, search);
      set({
        pharmacies: data.data.pharmacies,
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
}));

export default usePharmaciesStore;
