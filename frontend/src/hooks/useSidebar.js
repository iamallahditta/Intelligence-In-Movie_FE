import { create } from "zustand";

const useSidebar = create((set) => ({
    isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 768 : true,
    setIsSidebarOpen: (value) => set((state) => ({ isSidebarOpen: value })),
}));

export default useSidebar