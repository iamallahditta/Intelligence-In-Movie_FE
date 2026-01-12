import { useEffect, useRef, useState } from 'react';

const useMediaRecorder = (onDataAvailable, onStop) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          chunks.current.push(e.data);
          if (onDataAvailable) {
            onDataAvailable(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
          if (onStop) {
            onStop(audioBlob);
          }
        };

        mediaRecorderRef.current.start(100); // Collect audio data every 100ms
        setIsRecording(true);
        setIsPaused(false);
      } catch (error) {
        console.error('Error accessing the microphone: ', error);
      }
    };

    if (isRecording) {
      startRecording();
    } else {
      mediaRecorderRef.current?.stop();
    }

    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [isRecording, onDataAvailable, onStop]);

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setIsPaused(false);
  };

  return { isRecording, isPaused, setIsRecording, pauseRecording, resumeRecording };
};

export default useMediaRecorder;
