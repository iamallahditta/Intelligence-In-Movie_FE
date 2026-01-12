/* eslint-disable */
"use client";
import axios from "axios";
import { Mic, Undo2, Upload } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { CiPause1 } from "react-icons/ci";
import { IoPlayOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Button from "../../components/Button";
import FileUpload from "../../components/FileUpload";
import LanguageSelector from "../../components/LanguageSelector";
import MicrophoneButton from "../../components/MicrophoneButton";
import SelectPatientModal from "../../components/modal/selectPatientModal";
import StayOrOutModal from "../../components/modal/StayOrOutModal";
import OutlineSelect from "../../components/OutlineSelect";
import SearchableSelect from "../../components/SearchableSelect";
import useSelectPatientModal from "../../hooks/modal/useSelectPatientModal";
import { usePatientsQuery } from "../../hooks/usePatientsQuery";
import { useTemplateNamesQuery } from "../../hooks/useTemplatesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "../../hooks/usePatientsQuery";
import { usePrompt } from "../../hooks/usePrompt";
import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import { convertOnServer } from "../../utils/audioConverter";
import { uploadAudioFile } from "../../utils/uploadAudio";
import { uploadJsonFile } from "../../utils/uploadJson";
const { v4: uuidv4 } = require("uuid");

export default function Recording() {
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [partial, setPartial] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const {
    patient,
    analyzing,
    setAnalyzing,
    uploading,
    setUploading,
    setPatient,
  } = useRecordingData();

  const {
    setRecordings,
    recordings,
    setActiveRecording,
    isPreOrLiveRecording,
    setIsPreOrLiveRecording,
    templateId,
    templateOption,
    setTemplateId,
  } = useRecordings();
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isInRecording, setIsInRecording] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState("");
  const [debouncedTemplateSearch, setDebouncedTemplateSearch] = useState("");
  
  // Use React Query for patients and templates with search
  const { data: patients = [], isLoading: patientsLoading } = usePatientsQuery(debouncedPatientSearch);
  const { data: templates = [], isLoading: templatesLoading } = useTemplateNamesQuery(debouncedTemplateSearch);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { t } = useTranslation();

let recorderReady = false;
  let deepgramReadyReceived = false;

  const audioSegmentsRef = useRef([]);
  const allTranscriptsRef = useRef([]);
  const chunksRef = useRef([]);

  const { showModal, confirmLeave, cancelLeave } = usePrompt(
    isRecording || isInRecording
  );

  // First Features
  // formating transcript json live recording json
  function extractTranscriptObjectsWithEndTime(inputArray) {
    return inputArray.map((item, index) => {
      const startSeconds = timeStringToSeconds(item.timestamp);
      return {
        id: `${index}`,
        text: item.text,
        from: item.speaker,
        time: startSeconds,
        endTime: startSeconds + 3,
      };
    });
  }

  //  time stump
  function timeStringToSeconds(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  // handle stop and save audio blob
  const handleStopAndSaveBlob = () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (blob.size > 0) {
      audioSegmentsRef.current.push(blob);
      chunksRef.current = [];
    }
  };

  // audio merging check before stop
  const flushChunksToSegment = () => {
    const chunkBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (chunkBlob.size > 0) {
      audioSegmentsRef.current.push(chunkBlob);
      chunksRef.current = [];
    }
  };

  // start new Recording
  const startRecording = async () => {
    setStatusMessage(`🎙️${t("initializing_recording")}`);

    const proceedWithRecording = async () => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        toast.error("Socket connection failed. Please try again.");
        return;
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        if (stream?.getTracks)
          stream.getTracks().forEach((track) => track.stop());
        setStatusMessage("🎤 Microphone access denied or not available");

        let message = "Microphone access is required to start recording.";
        if (err.name === "NotAllowedError") {
          message =
            "Microphone access was denied. Please enable it in your browser settings.";
        } else if (err.name === "NotFoundError") {
          message =
            "No microphone device found. Please connect one and try again.";
        }

        toast.error(message);
        return;
      }

      // Reset states only on FIRST recording
      if (!isRecording) {
        setTranscript([]);
        allTranscriptsRef.current = [];
        audioSegmentsRef.current = [];
        setPartial("");
        setAudioUrl(null);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const handleTranscript = (data) => {
        setStatusMessage(`📝 ${t("transcribing_recording")}`);
        const alt = data?.channel?.alternatives?.[0];
        if (!alt) return;

        const transcriptText = alt.transcript;
        const isFinal = data?.is_final;
        const words = alt?.words || [];
        const speaker = words[0]?.speaker ?? 0;
        const label = `${speaker + 1}`;
        const startTime = words[0]?.start ?? Date.now() / 1000;
        const timestamp = new Date(startTime * 1000).toLocaleTimeString();

        if (!transcriptText) return;

        if (isFinal) {
          const newLine = { speaker: label, text: transcriptText, timestamp };
          allTranscriptsRef.current.push(newLine);
          setTranscript((prev) => [...prev, newLine]);
          setPartial("");
        } else {
          setPartial(transcriptText);
        }
      };

      socket.off("transcript");
      socket.on("transcript", handleTranscript);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          socket.emit("audio-chunk", e.data);
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error("🎤 MediaRecorder error:", e);
        toast.error("Recording error occurred.");
        setStatusMessage("❌ Recording error.");
      };

      mediaRecorder.onstop = handleStopAndSaveBlob;

      mediaRecorderRef.current = mediaRecorder;
      recorderReady = true;

      // If Deepgram was already ready, start now
      if (deepgramReadyReceived) {
        tryStartRecording();
      }

      setIsPaused(false);
      setTranscript([]);
      setPartial("");
      setAudioUrl(null);
    };

    if (!socketRef.current || socketRef.current.disconnected) {
      initializeSocket(proceedWithRecording);
    } else {
      await proceedWithRecording();
    }
  };

  // Get audio duration
  const getAudioDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        if (audio?.duration === Infinity) {
          audio.currentTime = 1e101;
          audio.ontimeupdate = () => {
            audio.ontimeupdate = null;
            audio.currentTime = 0;
            resolve(audio?.duration);
          };
        } else {
          resolve(audio?.duration);
        }
      };
    });
  };

  // saving recording to Data base
  const saveRecordingToDB = async (recordingData) => {
    try {
      return await axios.post("/v1/api/record/upload", recordingData);
    } catch (err) {
      console.error("DB Upload Failed:", err);
      throw err;
    }
  };

  const cleanupAfterStop = (mediaRecorder) => {
    setStatusMessage("");
    setAnalyzing(false);
    setUploading(false);
    setIsInRecording(false);

    if (mediaRecorder?.state !== "inactive") {
      mediaRecorder?.stop();
    }

    const stream = mediaRecorder?.stream;
    if (stream) {
      stream?.getTracks()?.forEach((track) => track?.stop());
    }

    cleanupMedia();
    socketRef?.current?.off("transcript");
  };

  const stopRecording = async () => {
    const socket = socketRef.current;
    const mediaRecorder = mediaRecorderRef.current;

    console.log("🛑 Stopping recording...");
    console.log("Socket connected:", socket?.connected);
    console.log("MediaRecorder state:", mediaRecorder?.state);

    if (!socket?.connected || !mediaRecorder) {
      toast.error("Recording is not active or socket connection lost.");
      return;
    }

    setIsRecording(false);
    setIsInRecording(false);
    setIsPaused(false);
    setAnalyzing(true);
    setUploading(true);

    if (!transcript || transcript.length === 0) {
      toast.error(
        "Recording not found. Please record something before proceeding."
      );
      cleanupAfterStop(mediaRecorder);
      return;
    }

    return new Promise((resolve) => {
      flushChunksToSegment();
      // ✅ First set listener
      mediaRecorder.onstop = async () => {
        try {
          setStatusMessage(`📤 ${t("uploading_analysis")}`);

          const finalBlob = new Blob(audioSegmentsRef.current, {
            type: "audio/webm",
          });
          const audioUrl = URL.createObjectURL(finalBlob);
          setAudioUrl(audioUrl);
          console.log("🔊 Audio blob URL:", audioUrl);

          const duration = await getAudioDuration(audioUrl);
          const formattedDuration = moment.utc(duration * 1000).format("mm:ss");

          const transcriptResult = extractTranscriptObjectsWithEndTime(
            allTranscriptsRef.current
          );

          setStatusMessage(`⬆️ ${t("uploading_transcript")}`);
          const uploadedUrl = await uploadJsonFile(transcriptResult);
          console.log("📄 Transcript JSON uploaded:", uploadedUrl);

          setStatusMessage(`🔄 ${t("converting_audio")}...`);
          const mp3Blob = await convertOnServer(finalBlob);
          console.log("🎧 Audio converted");

          setStatusMessage(`📁 ${t("uploading_audio_file")}...`);
          const uploadedAudioData = await uploadAudioFile(mp3Blob);
          console.log("📤 Audio uploaded:", uploadedAudioData);

          setStatusMessage(`☁️ ${t("uploading_full_recording")}...`);
          const uploadResp = await saveRecordingToDB({
            patient,
            audio: {
              id: uploadedAudioData.id,
              url: uploadedAudioData.url,
              name: "audio_recording.webm",
              duration: formattedDuration,
              date: moment().format("MMM DD, YYYY"),
            },
            transcriptJson: uploadedUrl,
          });

          try {
            setStatusMessage(`🤖 ${t("ai_processing")}...`);
            const aiResp = await axios.post(process.env.REACT_APP_AI_URL, {
              url: uploadedUrl.url,
              id: uploadResp?.data?.data?.id,
              template_id: templateId,
              language,
            });
            console.log("AI Processing Response:", aiResp.data);
          } catch (error) {
            console.error("❌ AI Processing Error:", error);
            toast.error("AI Failed to process conversation");
          }

          setStatusMessage(`🛠️ ${t("preparing_output")}...`);
          const recordingResponse = await axios.get(
            `/v1/api/record/${uploadResp?.data?.data?.id}`
          );
          const completeRecording = recordingResponse.data.data;

          setRecordings([
            completeRecording,
            ...recordings?.filter((r) => r?.patientId === patient?.id),
          ]);

          setActiveRecording(completeRecording);

          // Invalidate React Query cache to refetch patients with new recording
          queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
          toast.success("Recording uploaded successfully");
          navigate("/patient_recordings");
        } catch (error) {
          console.error("❌ Processing error:", error);
          toast.error("Failed to process recording");
          navigate("/");
        } finally {
          cleanupAfterStop(mediaRecorderRef.current);
          cleanupMedia();
          resolve();
        }
      };

      // ✅ Then emit stop signal and stop the media recorder
      socket.off("transcript");
      socket.emit("stop-recording");

      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }

      const stream = mediaRecorder.stream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
  };

  // clean up all media after stop recording
  const cleanupMedia = () => {
    const socket = socketRef.current;

    if (socket && socket.connected) {
      socket.disconnect();
    }

    socketRef.current = null;
    mediaRecorderRef.current = null;
    setPartial("");
    setAnalyzing(false);
    setUploading(false);
    setIsInRecording(false);
    setIsPreOrLiveRecording("both");
  };

  const pauseRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") {
      await new Promise((resolve) => {
        recorder.onstop = () => {
          handleStopAndSaveBlob(); // ✅ consistent logic
          resolve();
        };
        recorder.stop();
      });

      setIsPaused(true);
      setStatusMessage("⏸️ Recording paused.");
    }
  };

  const resumeRecording = async () => {
    setIsPaused(false);
    setStatusMessage("🔄 Reconnecting...");

    // ✅ CLEAN UP OLD SOCKET (if any)
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    await initializeSocket(startRecording);
  };

  // initailze the socket
  const initializeSocket = (onConnected) => {
    const socket = io(process.env.REACT_APP_API_URL || "https://vocalli.ai", {
      transports: ["websocket"],
      secure:true
    });

    socketRef.current = socket;

    socket.onAny((event, ...args) => {
      console.log("📡 Socket event received:", event, args);
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to Deepgram server");

      socket.emit("start-deepgram", {
        language: language,
        domain: language === "en" ? "medical" : "general",
        model: language === "en" ? "nova-3" : "nova-2",
      });

      if (typeof onConnected === "function") {
        onConnected();
      }
    });

    socket.on("deepgram-ready", () => {
      console.log("✅ deepgram-ready received (frontend)");
      deepgramReadyReceived = true;

      if (recorderReady) {
        tryStartRecording();
      }
    });

    socket.on("disconnect", () => {
      console.warn("🔌 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });
  };

  const tryStartRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (!mediaRecorder) {
      console.warn("⚠️ MediaRecorder is not initialized.");
      return;
    }

    if (mediaRecorder.state === "recording") {
      console.warn("⚠️ MediaRecorder already recording.");
      return;
    }

    try {
      mediaRecorder.start(1000);
      setIsRecording(true);
      setStatusMessage(`✅ ${t("recording_started")}`);
      console.log("🎤 MediaRecorder started");
    } catch (err) {
      console.error("❌ MediaRecorder start error:", err);
      toast.error("Failed to start recording.");
    }
  };

  // Second fetrues
  // for pre Recorded we can use... (second features)

  // Helper function to detect language from text
  const detectLanguageFromText = (text) => {
    if (!text || typeof text !== 'string' || text.trim().length === 0) return null;
    
    const textLower = text.toLowerCase();
    
    // Check for Chinese characters (CJK Unified Ideographs) - highest priority
    const chinesePattern = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
    if (chinesePattern.test(text)) {
      return "zh-CN";
    }
    
    // Check for French-specific characters and common French words
    const frenchAccents = /[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/;
    const frenchCommonWords = /\b(le|la|les|de|du|des|et|ou|est|sont|avec|pour|dans|sur|par|une|un|être|avoir|faire|aller|venir|voir|savoir|dire|donner|prendre|mettre|patient|docteur|médecin|maladie|symptôme|traitement|médicament|consultation|diagnostic)\b/i;
    
    const hasFrenchAccents = frenchAccents.test(text);
    const hasFrenchWords = frenchCommonWords.test(text);
    const frenchAccentCount = (text.match(/[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/g) || []).length;
    
    // If text has French accents or multiple French words, it's likely French
    if (hasFrenchAccents || (hasFrenchWords && frenchAccentCount > 0)) {
      // Count French word matches
      const frenchWordMatches = (textLower.match(/\b(le|la|les|de|du|des|et|ou|est|sont|avec|pour|dans|sur|par|une|un|être|avoir|faire|aller|venir|voir|savoir|dire|donner|prendre|mettre|patient|docteur|médecin)\b/g) || []).length;
      
      // If we have French accents or multiple French words, it's French
      if (frenchAccentCount >= 2 || frenchWordMatches >= 3) {
        return "fr";
      }
    }
    
    // Default to English if no specific patterns found
    // This is a simple heuristic - English is the most common
    return "en";
  };

  async function convertTranscription(transcriptionData, selectedLanguage = "en") {
    try {
      const checkNode = await axios.get(`/v1/api/create-note`);
      const isCreateNote = checkNode.data.allowed || false;

      if (!isCreateNote) {
        toast.error(checkNode.data.message || "You are not allowed to record.");
        cleanupAfterStop(mediaRecorderRef.current);
        return;
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong.";
      toast.error(message);
      cleanupAfterStop(mediaRecorderRef.current);
      return;
    }
    const words =
      transcriptionData.transcription.results.channels[0].alternatives[0].words;
    const output = [];

    let currentText = "";
    let startTime = null;
    let endTime = null;
    let id = 0;
    let allText = ""; // Collect all text for language detection

    words.forEach((wordObj, index) => {
      const { punctuated_word, start, end } = wordObj;

      if (startTime === null) {
        startTime = start;
      }

      currentText += (currentText ? " " : "") + punctuated_word;
      allText += (allText ? " " : "") + punctuated_word;
      endTime = end;

      // End of sentence if punctuated_word ends with ., !, ? or it's the last word
      if (/[.?!]$/.test(punctuated_word) || index === words.length - 1) {
        output.push({
          id: id.toString(),
          text: currentText.trim(),
          from: "1",
          time: Math.round(startTime * 1000),
          endTime: Math.round(endTime * 1000),
        });
        id++;
        currentText = "";
        startTime = null;
        endTime = null;
      }
    });

    // Detect language from transcribed text
    const detectedLanguage = detectLanguageFromText(allText);
    
    // Map detected language to match our language codes
    const langMap = {
      "en": "en",
      "fr": "fr",
      "zh-CN": "zh-CN",
      "zh": "zh-CN"
    };
    const normalizedDetectedLang = langMap[detectedLanguage] || detectedLanguage;
    const normalizedSelectedLang = langMap[selectedLanguage] || selectedLanguage;
    if (normalizedDetectedLang && normalizedDetectedLang !== normalizedSelectedLang) {
      const languageNames = {
        "en": "English",
        "fr": "French",
        "zh-CN": "Chinese"
      };
      
      throw new Error(
        `❌ Language Mismatch Detected!\n\n` +
        `Selected Language: ${languageNames[normalizedSelectedLang] || normalizedSelectedLang}\n` +
        `Detected Language in Audio: ${languageNames[normalizedDetectedLang] || normalizedDetectedLang}\n\n`
      );
    }
    return output;
  }

  const handleUploadAudioFile = async (e) => {
    if (!patient || !templateId) {
      toast.error(
        "No Patient/TemplateId Found for recording. Please select first"
      );
      cleanupMedia();
      setUploading(false);
      setStatusMessage("");
      setAnalyzing(false);
      return;
    }
    setIsPreOrLiveRecording("record");
    setUploading(true);

    const file = e.target.files[0];
    if (!file) return;

    // ✅ Allow Only Audio Files
    // ✅ Allow Only Audio Files (specifically MP3)
    if (!file.type.startsWith("audio/") || file.type !== "audio/mpeg") {
      toast.error(
        "Only MP3 audio files are allowed. Please select a valid MP3 file."
      );
      setUploading(false);
      setStatusMessage("");
      setAnalyzing(false);
      cleanupAfterStop(mediaRecorderRef.current);
      return;
    }

    try {
      // 1️⃣ Calculate Duration First
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = async () => {
        const durationInSeconds = audio.duration; // Example: 14.95
        const totalSeconds = Math.floor(durationInSeconds); // Remove milliseconds

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedDuration = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        try {
          setStatusMessage(`📁 ${t("uploading_audio_file")}...`);

          // 2️⃣ Upload Audio File with calculated duration
          const uploadedAudioData = await uploadAudioFile(file);
          console.log(uploadedAudioData);

          setStatusMessage(`⬆️ ${t("uploading_transcript")} `);

          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/v1/api/transcribe-audio`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: uploadedAudioData.url }),
            }
          );

          if (!res.ok) {
            toast.error("Transcription Fail, try again.");
            setStatusMessage("");
            setAnalyzing(false);
            setUploading(false);
            cleanupMedia();
            return;
          }

          const transcriptionData = await res.json();
          console.log("Transcription Result:", transcriptionData);

          // Convert transcription and validate language
          let convertedJsonArray;
          try {
            convertedJsonArray = await convertTranscription(
              transcriptionData,
              language // Pass selected language for validation
            );
            console.log("Formatted Transcription JSON:", convertedJsonArray);
          } catch (langError) {
            // Language mismatch error
            toast.error(langError.message || "Language mismatch detected in audio file");
            setStatusMessage("");
            setAnalyzing(false);
            setUploading(false);
            cleanupMedia();
            return;
          }

          const uploadedUrl = await uploadJsonFile(convertedJsonArray);

          setStatusMessage(`☁️ ${t("uploading_full_recording")}...`);
          const uploadResp = await saveRecordingToDB({
            patient,
            audio: {
              id: uploadedAudioData.id,
              url: uploadedAudioData.url,
              name: "audio_recording.webm",
              duration: formattedDuration,
              date: moment().format("MMM DD, YYYY"),
            },
            transcriptJson: uploadedUrl,
          });

          try {
            setStatusMessage(`🤖 ${t("ai_processing")}...`);
            const response = await axios.post(process.env.REACT_APP_AI_URL, {
              url: uploadedUrl.url,
              id: uploadResp?.data?.data?.id,
              template_id: templateId,
              language,
            });
            console.log("AI Processing Response:", response.data);
          } catch (error) {
            console.error("AI Processing Error:", {
              message: error.message,
              response: error.response?.data,
            });
            toast.error("AI Failed to process conversation");
          }

          setStatusMessage(`🛠️ ${t("preparing_output")}...`);
          const recordingResponse = await axios.get(
            `/v1/api/record/${uploadResp?.data?.data?.id}`
          );
          const completeRecording = recordingResponse.data.data;

          setRecordings([
            completeRecording,
            ...recordings?.filter((r) => r?.patientId === patient?.id),
          ]);
          setActiveRecording(completeRecording);

          // Invalidate React Query cache to refetch patients with new recording
          queryClient.invalidateQueries({ queryKey: patientKeys.lists() });

          cleanupMedia();
          toast.success("Recording uploaded successfully");
          navigate("/patient_recordings");
        } catch (err) {
          cleanupMedia();
          console.error("Upload error:", err);
          toast.error("Failed to upload recording");
        }
      };
    } catch (err) {
      cleanupMedia();
      cleanupAfterStop(mediaRecorderRef.current);
      console.error("Upload error:", err);
      toast.error("Failed to upload recording");
    }
  };

  // Thrird Features

  const handleTextJsonFileUpload = async (e) => {
    if (!patient || !templateId) {
      toast.error(
        "No Patient/TemplateId Found for recording. Please select first"
      );
      cleanupMedia();
      setUploading(false);
      setStatusMessage("");
      setAnalyzing(false);
      return;
    }

    setIsPreOrLiveRecording("jsonUpload");
    setUploading(true);

    const file = e.target.files?.[0];
    if (!file) return;

    const isTxtFile = file.type === "text/plain" || file.name.endsWith(".txt");

    if (!isTxtFile) {
      toast.error("Only .txt files are allowed.");
      cleanupMedia();
      setUploading(false);
      setStatusMessage("");
      setAnalyzing(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const content = reader.result;

        // Parse the plain text into a transcript array
        const lines = content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 0) {
          throw new Error("File is empty. Please provide a valid transcript file.");
        }

        // STEP 1: First check - Validate file format (must have "speaker: message" format)
        // Check if ALL lines have the required format with speaker labels
        const linesWithoutFormat = [];
        lines.forEach((line, index) => {
          const colonIndex = line.includes(":") ? line.indexOf(":") : line.indexOf("：");
          if (colonIndex === -1) {
            // Line doesn't have colon - invalid format
            linesWithoutFormat.push({
              lineNumber: index + 1,
              line: line
            });
          } else {
            const speakerRaw = line.substring(0, colonIndex).trim();
            const message = line.substring(colonIndex + 1).trim();
            // Check if speaker label exists and message exists
            if (!speakerRaw || !message) {
              linesWithoutFormat.push({
                lineNumber: index + 1,
                line: line
              });
            }
          }
        });

        // If any line doesn't have proper format, reject the file
        if (linesWithoutFormat.length > 0) {
          const languageCodeMap = {
            "en": "en",
            "fr": "fr",
            "zh-CN": "zh-CN",
            "zh": "zh-CN"
          };
          const currentLang = languageCodeMap[language] || language || "en";
          const originalLang = i18n.language;
          i18n.changeLanguage(currentLang);
          const expectedDoctorLabel = t("speaker_doctor");
          const expectedPatientLabel = t("speaker_patient");
          i18n.changeLanguage(originalLang);

          throw new Error(
            `❌ Invalid File Format!\n\n` +
            `Your file must follow this format:\n` +
            `"${expectedDoctorLabel}: message"\n` +
            `"${expectedPatientLabel}: message"\n\n`
          );
        }

        // STEP 2: Extract all message content (text after speaker labels) for language detection
        const allMessages = [];
        lines.forEach((line) => {
          const colonIndex = line.includes(":") ? line.indexOf(":") : line.indexOf("：");
          const message = line.substring(colonIndex + 1).trim();
          if (message) {
            allMessages.push(message);
          }
        });

        // STEP 3: Detect language from the actual conversation messages
        const allMessageText = allMessages.join(" ");
        const detectedLanguage = detectLanguageFromText(allMessageText);
        
        // Map detected language to match our language codes
        const languageCodeMap = {
          "en": "en",
          "fr": "fr",
          "zh-CN": "zh-CN",
          "zh": "zh-CN"
        };
        const normalizedDetectedLang = languageCodeMap[detectedLanguage] || detectedLanguage;
        const normalizedSelectedLang = languageCodeMap[language] || language;
        
        // Validate that conversation text language matches selected language
        if (normalizedDetectedLang && normalizedDetectedLang !== normalizedSelectedLang) {
          const languageNames = {
            "en": "English",
            "fr": "French",
            "zh-CN": "Chinese"
          };
          
          throw new Error(
            `❌ Language Mismatch Detected!\n\n` +
            `Selected Language: ${languageNames[normalizedSelectedLang] || normalizedSelectedLang}\n` +
            `Detected Language in Conversation Text: ${languageNames[normalizedDetectedLang] || normalizedDetectedLang}\n\n`
          );
        }

        // Helper function to normalize speaker labels and validate against selected language
        const normalizeSpeaker = (speakerRaw, selectedLang) => {
          const speaker = speakerRaw.trim();
          const speakerLower = speaker.toLowerCase();
          
          // Map language codes to i18next language codes
          const langMap = {
            "en": "en",
            "fr": "fr", 
            "zh": "zh-CN",
            "zh-CN": "zh-CN"
          };
          const currentLang = langMap[selectedLang] || selectedLang || "en";
          
          // Temporarily change i18n language to get correct translations
          const originalLang = i18n.language;
          i18n.changeLanguage(currentLang);
          
          // Get translated speaker labels for selected language
          const doctorLabel = t("speaker_doctor", { returnObjects: false });
          const doctorAltLabels = t("speaker_doctor_alt", { returnObjects: false }) || "";
          const patientLabel = t("speaker_patient", { returnObjects: false });
          const patientAltLabels = t("speaker_patient_alt", { returnObjects: false }) || "";
          
          // Restore original language
          i18n.changeLanguage(originalLang);
          
          // Check for doctor labels (case-insensitive for non-Chinese languages)
          const doctorVariants = [doctorLabel];
          if (doctorAltLabels) {
            doctorVariants.push(...doctorAltLabels.split(",").map(l => l.trim()));
          }
          
          // For non-Chinese languages, compare case-insensitively
          if (currentLang !== "zh-CN" && currentLang !== "zh") {
            if (doctorVariants.some(variant => speakerLower === variant.toLowerCase())) {
              return { normalized: "doctor", isValid: true };
            }
          } else {
            // For Chinese, compare exactly (case-sensitive)
            if (doctorVariants.some(variant => speaker === variant)) {
              return { normalized: "doctor", isValid: true };
            }
          }
          
          // Check for patient labels
          const patientVariants = [patientLabel];
          if (patientAltLabels) {
            patientVariants.push(...patientAltLabels.split(",").map(l => l.trim()));
          }
          
          // For non-Chinese languages, compare case-insensitively
          if (currentLang !== "zh-CN" && currentLang !== "zh") {
            if (patientVariants.some(variant => speakerLower === variant.toLowerCase())) {
              return { normalized: "patient", isValid: true };
            }
          } else {
            // For Chinese, compare exactly (case-sensitive)
            if (patientVariants.some(variant => speaker === variant)) {
              return { normalized: "patient", isValid: true };
            }
          }
          
          // If no match found, it's invalid for the selected language
          return { normalized: speaker, isValid: false };
        };

        // STEP 4: Fourth check - Validate speaker labels match selected language
        // Validate and parse transcripts with language checking
        const invalidLines = [];
        // Reuse the languageCodeMap from above
        const currentLang = languageCodeMap[language] || language || "en";
        const originalLang = i18n.language;
        
        // Temporarily set language to get correct labels for validation
        i18n.changeLanguage(currentLang);
        const expectedDoctorLabel = t("speaker_doctor");
        const expectedPatientLabel = t("speaker_patient");
        i18n.changeLanguage(originalLang);
        
        const transcripts = lines.map((line, index) => {
          // All lines should have colon format (already validated in STEP 1)
          const colonIndex = line.includes(":") ? line.indexOf(":") : line.indexOf("：");
          const speakerRaw = line.substring(0, colonIndex).trim();
          const message = line.substring(colonIndex + 1).trim();
          const result = normalizeSpeaker(speakerRaw, language);
          
          // If speaker label doesn't match selected language, mark as invalid
          if (!result.isValid) {
            invalidLines.push({
              lineNumber: index + 1,
              speaker: speakerRaw,
              line: line
            });
          }

          return {
            id: String(index),
            from: result.normalized,
            text: message,
            time: index * 1000, // dummy timestamp
            endTime: (index + 1) * 1000,
          };
        });

        // If there are invalid speaker labels, throw an error and prevent upload
        if (invalidLines.length > 0) {
          const languageNames = {
            "en": "English",
            "fr": "French",
            "zh-CN": "Chinese"
          };
          const langName = languageNames[currentLang] || language;
          
          const errorMessage = `❌ Language Mismatch Error!\n\n` +
            `Selected Language: ${langName} (${language})\n` +
            `Expected speaker labels: "${expectedDoctorLabel}" or "${expectedPatientLabel}"\n\n`;
          
          throw new Error(errorMessage);
        }

        const convertedJson = { transcripts };
        setStatusMessage(`⬆️ ${t("uploading_transcript")} `);
        const uploadedUrl = await uploadJsonFile(convertedJson);

        // Create valid dummy audio object
        const dummyAudio = {
          id: uuidv4(),
          url: "https://example.com/no-audio.mp3",
          name: "text-only-upload.webm",
          duration: "00:00",
          date: moment().format("MMM DD, YYYY"),
        };
        setStatusMessage(`☁️ ${t("uploading_full_recording")}...`);
        const uploadResp = await saveRecordingToDB({
          patient,
          audio: dummyAudio,
          transcriptJson: uploadedUrl,
        });

        try {
          setStatusMessage(`🤖 ${t("ai_processing")}...`);
          const response = await axios.post(process.env.REACT_APP_AI_URL, {
            url: uploadedUrl.url,
            id: uploadResp?.data?.data?.id,
            template_id: templateId,
            language,
          });
          console.log("AI Processing Response:", response.data);
        } catch (error) {
          console.error("AI Processing Error:", {
            message: error.message,
            response: error.response?.data,
          });
          toast.error("AI Failed to process conversation");
        }

        setStatusMessage(`🛠️ ${t("preparing_output")}...`);
        const recordingResponse = await axios.get(
          `/v1/api/record/${uploadResp?.data?.data?.id}`
        );

        const completeRecording = recordingResponse.data.data;

        setRecordings([
          completeRecording,
          ...recordings?.filter((r) => r?.patientId === patient?.id),
        ]);
        setActiveRecording(completeRecording);

        // Invalidate React Query cache to refetch patients with new recording
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() });

        toast.success("Text file uploaded successfully");
        navigate("/patient_recordings");
      } catch (error) {
        // Show user-friendly error message
        const errorMessage = 
          error?.message || 
          error?.response?.data?.error || 
          "Failed to parse the file. Please ensure your file follows the format: 'doctor: message' or 'patient: message' on each line.";
        
        toast.error(errorMessage);
        console.error("File parsing error:", error);

        cleanupMedia();
        cleanupAfterStop(mediaRecorderRef.current);
      } finally {
        cleanupAfterStop(mediaRecorderRef.current);
        setUploading(false);
        setAnalyzing(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the file.");
      cleanupMedia();
      setUploading(false);
      setAnalyzing(false);
    };

    reader.readAsText(file);
  };

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPatientSearch(patientSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTemplateSearch(templateSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [templateSearch]);

  // dropdown options
  const templateOptions = templates.map((t) => ({
    value: t.id,
    label: `${t.templateName || "Untitled Template"}${
      !t.userId ? " (Default)" : ""
    }`,
    templateName: t.templateName,
    id: t.id,
  }));

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.medicalId})`,
    ...p,
  }));

  // check befor start use feature

  const CheckBeforeStart = async () => {
    try {
      const checkNode = await axios.get(`/v1/api/create-note`);
      const isCreateNote = checkNode.data.allowed || false;

      if (!isCreateNote) {
        toast.error(checkNode.data.message || "You are not allowed to record.");
        cleanupAfterStop(mediaRecorderRef.current);
        return false; // ❗ Must return false
      }

      return true; // ✅ Recording is allowed
    } catch (error) {
      console.error("❌ API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong.";
      toast.error(message);
      cleanupAfterStop(mediaRecorderRef.current);
      return false; // ❗ Also return false on error
    }
  };

  // Useffect

  useEffect(() => {
    if (!patient || !patient.id) return;

    const selectedOption = {
      value: patient.id,
      label: `${patient.firstName} ${patient.lastName} (${patient.medicalId})`,
      ...patient,
    };

    setSelectedPatient(selectedOption);
  }, [patient]);

  useEffect(() => {
    if (!templateId || !templateOptions?.length) return;

    const matched = templateOptions.find((t) => t.id === templateId);
    if (matched) {
      setSelectedTemplate(matched);
    }
  }, [templateId]);

  useEffect(() => {
    setIsPreOrLiveRecording("both");
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRecording]);

  return (
    <div className="flex flex-col h-full relative ">
      {isPreOrLiveRecording !== "both" &&
        !uploading &&
        !isRecording &&
        isPreOrLiveRecording !== "live" && (
          <div
            onClick={() => {
              setIsPreOrLiveRecording("both");
            }}
            className="flex items-center gap-3 p-6 cursor-pointer"
          >
            <Undo2 />
          </div>
        )}
      {isPreOrLiveRecording === "both" && (
        <div className="px-6 py-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t("select_option")}</h1>
            <p className="text-sm">{t("choose_audio_creation_method")}</p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-8 md:flex-row flex-col">
            <LanguageSelector setlang={setLanguage} />
            <SearchableSelect
              options={patientOptions}
              value={selectedPatient}
              onChange={(selected) => {
                setSelectedPatient(selected);
                setPatient(selected);
              }}
              placeholder={t("select_patient")}
              onSearchChange={setPatientSearch}
              searchValue={patientSearch}
              isLoading={patientsLoading}
            />

            <SearchableSelect
              options={templateOptions}
              value={selectedTemplate}
              onChange={(opt) => {
                setSelectedTemplate(opt);
                setTemplateId(opt.value);
              }}
              placeholder={t("select_template")}
              onSearchChange={setTemplateSearch}
              searchValue={templateSearch}
              isLoading={templatesLoading}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 items-center justify-center mt-auto md:flex-row">
        {isPreOrLiveRecording === "both" && (
          <div className="w-full text-center flex sm:flex-row flex-col gap-4 px-4">
            <div className="w-full shadow-[0_12px_20px_0_#0057FF14] px-4 py-6 cursor-pointer flex flex-col gap-2 rounded-md items-center justify-center">
              <img
                src="/assets/recordingMic.svg"
                alt=""
                width={32}
                height={50}
              />
              <h3 className="text-lg font-semibold">{t("start_recording")} </h3>
              <p className="text-xs font-normal">
                {t("record_audio_description")}
              </p>
              <div className="max-w-fit mt-4 text-sm">
                <Button
                  onClick={async () => {
                    setIsInRecording(true);
                    if (
                      !patient ||
                      Object.keys(patient).length === 0 ||
                      !templateId
                    ) {
                      toast.error(
                        "Patient or template not selected. Please select one to continue"
                      );
                      setIsInRecording(false);
                    } else {
                      const ok = await CheckBeforeStart();
                      if (ok) {
                        setIsPreOrLiveRecording("live");
                        startRecording();
                      }
                    }
                  }}
                  label={t("start_recording_button")}
                  IconLeft={() => <Mic size={14} />}
                />
              </div>
            </div>

            <div className="w-full shadow-[0_12px_20px_0_#0057FF14] px-4 py-6 cursor-pointer flex flex-col gap-2 rounded-md items-center justify-center">
              <img src="/assets/JsonFIle.svg" alt="" width={50} height={50} />

              <h3 className="text-lg font-semibold">
                {t("upload_text_file")}{" "}
              </h3>
              <p className="text-xs font-normal">
                {t("upload_text_description")}
              </p>
              <div className="max-w-fit mt-4 text-sm">
                <Button
                  onClick={async () => {
                    if (
                      !patient ||
                      Object.keys(patient).length === 0 ||
                      !templateId
                    ) {
                      toast.error(
                        "Patient or template not selected. Please select one to continue"
                      );
                    } else {
                      const ok = await CheckBeforeStart();
                      if (ok) {
                        setIsPreOrLiveRecording("jsonUpload");
                      }
                    }
                  }}
                  label={t("upload_file_button")}
                  IconLeft={() => <Upload size={14} />}
                />
              </div>
            </div>

            <div className="w-full shadow-[0_12px_20px_0_#0057FF14] px-4 py-6 cursor-pointer flex flex-col gap-2 rounded-md items-center justify-center">
              <img src="/assets/audioFile.svg" alt="" width={50} height={50} />

              <h3 className="text-lg font-semibold">
                {t("upload_audio_file")}{" "}
              </h3>
              <p className="text-xs font-normal">
                {t("upload_audio_description")}
              </p>
              <div className="max-w-fit mt-4 text-sm">
                <Button
                  onClick={async () => {
                    if (
                      !patient ||
                      Object.keys(patient).length === 0 ||
                      !templateId
                    ) {
                      toast.error(
                        "Patient or template not selected. Please select one to continue"
                      );
                    } else {
                      const ok = await CheckBeforeStart();
                      if (ok) {
                        setIsPreOrLiveRecording("record");
                      }
                    }
                  }}
                  label={t("upload_audio_button")}
                  IconLeft={() => <Upload size={14} />}
                />
              </div>
            </div>
          </div>
        )}
        {isPreOrLiveRecording === "live" && (
          <div
            className={`flex flex-col items-center ${
              isRecording ? "gap-4" : "gap-7"
            }`}
          >
            <div className="flex flex-row gap-7 items-center">
              <div
                onClick={() => {
                  if (!isRecording) return;
                  isPaused ? resumeRecording() : pauseRecording();
                }}
                className={`w-12 h-12 shadow-lg cursor-pointer bg-[#E7EAF1] rounded-full flex items-center justify-center ${
                  isRecording && !uploading ? "opacity-100" : "opacity-0"
                }`}
              >
                {isPaused ? (
                  <IoPlayOutline className="text-xl" />
                ) : (
                  <CiPause1 className="text-xl" />
                )}
              </div>

              <MicrophoneButton
                isRecording={isRecording && !isPaused}
                analyzing={analyzing}
                uploading={uploading}
                onClick={() => {
                  setUploading(true);
                  setAnalyzing(true);
                  setTimeout(() => {
                    stopRecording();
                  }, 4000);
                }}
              />

              <div
                onClick={() => {
                  setUploading(true);
                  setAnalyzing(true);
                  setTimeout(() => {
                    stopRecording();
                  }, 4000);
                }}
                className={`w-12 h-12 shadow-lg cursor-pointer bg-[#E7EAF1] rounded-full flex items-center justify-center ${
                  isRecording && !uploading ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-3 h-3 bg-red rounded-full" />
              </div>
            </div>

            <h1
              className={`font-light text-center ${
                isRecording || analyzing ? "opacity-100" : "opacity-0"
              }`}
            >
              {analyzing
                ? `⏳ ${t("please_wait")}`
                : isPaused
                ? "Paused"
                : t("recording")}
            </h1>

            <h1
              className={`font-light transition-opacity duration-300 ${
                statusMessage ? "opacity-100" : "opacity-0"
              }`}
            >
              {statusMessage}
            </h1>
          </div>
        )}

        {isPreOrLiveRecording === "record" && (
          <FileUpload
            accept="audio/*"
            label={t("drag_drop_audio")}
            buttonText={t("upload_audio_button")}
            iconColor="#0057FF"
            heading={t("upload_audio_file")}
            subLabel={t("click_to_browse")}
            uploading={uploading}
            statusMessage={statusMessage}
            onFileSelect={handleUploadAudioFile}
          />
        )}

        {isPreOrLiveRecording === "jsonUpload" && (
          <FileUpload
            accept=".json,.txt"
            label={t("drag_drop_text")}
            buttonText={t("upload_file_button")}
            iconColor="#28A745"
            heading={t("upload_text_file")}
            uploading={uploading}
            subLabel={t("click_to_browse")}
            statusMessage={statusMessage}
            onFileSelect={handleTextJsonFileUpload}
          />
        )}
      </div>

      <img src="/assets/wave.svg" alt="recording" className="w-full mt-auto" />
      <SelectPatientModal />

      {/* prevent route */}
      <StayOrOutModal
        isOpen={showModal}
        onClose={cancelLeave}
        onConfirm={() => {
          setIsRecording(false);
          setIsInRecording(false);
          cleanupAfterStop(mediaRecorderRef.current);
          confirmLeave();
        }}
        title="Recording in progress."
        message="Are you sure you want to leave and stop the recording?"
        stayLabel="Stay"
        leaveLabel="Leave"
      />
    </div>
  );
}
