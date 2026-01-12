import { create } from "zustand";

const useRecordings = create((set) => ({
  activeRecording: null,
  activeNote: null,
  activeIndex: 0,
  recordings: [],
  isRecordLoading: false,
  isPreOrLiveRecording: "both",
  templateOption: [],
  templateData: [],
  templateId: null,
  templateName: "",

  setRecordings: (value) => {
    if (typeof value === 'function') {
      set((state) => ({ 
        recordings: value(state.recordings)
      }));
    } else {
      // Otherwise, replace the recordings (for initial load)
      set((state) => ({ 
        recordings: Array.isArray(value) ? value : [] 
      }));
    }
  },
  setActiveRecording: (value) => set((state) => ({ activeRecording: value })),
  setActiveNote: (note) => set({ activeNote: note }),
  resetActiveNote: () => set({ activeNote: null }),
  setActiveIndex: (index) => set({ activeIndex: index }),
  setIsRecordLoading: (value) => set({ isRecordLoading: value }),
  setIsPreOrLiveRecording: (value) => set({ isPreOrLiveRecording: value }),
  setTemplateData: (data) => set({ templateData: data }),
  setTemplateOption: (data) => set({ templateOption: data }),
  setTemplateId: (id) => set({ templateId: id }),
  setTemplateName: (name) => set({ templateName: name }),
}));

export default useRecordings;
