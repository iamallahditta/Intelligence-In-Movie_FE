import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguage = create(
  persist(
    (set) => ({
      language: {
        label: "English",
        value: "en",
        flag: "/assets/english.svg",
      },
      setLanguage: (value) => set({ language: value }),
    }),
    {
      name: 'language-storage-speech-help', // Key for the storage
      getStorage: () => localStorage, // Use localStorage for persistent storage
    }
  )
);

export default useLanguage;