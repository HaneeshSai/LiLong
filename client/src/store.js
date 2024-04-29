import { create } from "zustand";

// Define your store
const useStore = create((set) => ({
  isloading: false,
  setIsloading: (data) => set({ isloading: data }),
}));

export default useStore;
