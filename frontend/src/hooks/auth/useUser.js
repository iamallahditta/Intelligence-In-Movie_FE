import { create } from "zustand";

const useUser = create((set) => ({
  user: "loading",
  setUser: (user) => set(() => ({ user })),
  
  pdfData: {},
  setPdfData: (data) => set(() => ({ pdfData: data })),

  subscription: null,
  setSubscription: (subscription) => set(() => ({ subscription })),
}));

export default useUser;
