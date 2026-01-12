import { create } from "zustand";

const usePatients = create((set) => ({
    loading:true,
    patients: [],
    setPatients: (value) => set((state) => ({ patients:value })),
    setLoading: (value) => set((state) => ({ loading:value })),
}));

export default usePatients