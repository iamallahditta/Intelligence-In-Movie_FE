import { create } from "zustand";

const useCurrentHash = create((set) => ({
    currentHash: '#home',
    setCurrentHash: (value) => set((state) => ({ currentHash: value })),

}));

export default useCurrentHash