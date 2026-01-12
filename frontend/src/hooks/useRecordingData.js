import { create } from "zustand";

const useRecordingData = create((set) => ({
  uploading: false,
  patient: null,
  analyzing: false,
  conversation: [],

  // Setters
  setConversation: (conversation) => set({ conversation }),
  setPatient: (patient) => set({ patient }),
  setUploading: (uploading) => set({ uploading }),
  setAnalyzing: (analyzing) => set({ analyzing }),

  // Reset State
  reset: () =>
    set({
      uploading: false,
      patient: null,
      analyzing: false,
      conversation: [],
    }),
}));

export default useRecordingData;
