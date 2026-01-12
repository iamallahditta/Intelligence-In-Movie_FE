import { create } from "zustand";

const useFullScreenRecording = create((set) => ({
    
    showFullScreenRecording:false,
    setShowFullScreenRecording:(value)=>set((state) => ({ showFullScreenRecording: value })),
   
}));

export default useFullScreenRecording
