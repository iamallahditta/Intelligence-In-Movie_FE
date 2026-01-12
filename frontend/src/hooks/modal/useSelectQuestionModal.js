import { create } from "zustand";

const useSelectQuestionModal = create((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ isOpen: true })),
  onClose: () => set((state) => ({ isOpen: false })),
}));

export default useSelectQuestionModal

