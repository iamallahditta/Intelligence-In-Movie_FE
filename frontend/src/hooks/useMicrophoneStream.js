import { useEffect, useRef } from "react";

const useMicrophoneStream = (socket, isRecording) => {
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isRecording) return;

    const start = async () => {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const int16Array = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          int16Array[i] = input[i] * 0x7fff;
        }
        socket.emit("audio-chunk", int16Array.buffer);
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
    };

    start();

    return () => {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    };
  }, [isRecording, socket]);
};

export default useMicrophoneStream;
