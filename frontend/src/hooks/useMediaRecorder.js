// import {
//   StartMedicalStreamTranscriptionCommand,
//   StartStreamTranscriptionCommand,
//   TranscribeStreamingClient,
// } from "@aws-sdk/client-transcribe-streaming";
// import { useEffect, useRef, useState } from "react";

// import { AudioUploader } from "../utils/uploadAudio";
// import useRecordingData from "./useRecordingData";

// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB minimum for S3

// function filterResults(array) {
//   if (!Array.isArray(array) || array.length === 0) {
//       return [];
//   }

//   const filtered = array.filter((item, index) => 
//       item.IsPartial === false || index === array.length - 1
//   );

//   return filtered;
// }

// function transformResults(results) {
//   if (!results) return {};

//   const transcript = results.Alternatives[0].Transcript;
//   const items = results.Alternatives[0].Items;

//   const speakers = new Set();
//   const finalTranscript = [];

//   let currentSpeaker = null;
//   let currentContent = "";
//   let startTime = null; // Start time of the current speaker's segment
//   let endTime = null; // End time of the current speaker's segment

//   items.forEach((item) => {
//     if (item.Type === "pronunciation") {
//       speakers.add(item.Speaker);

//       if (item.Speaker === currentSpeaker) {
//         // Same speaker, continue concatenating content
//         currentContent += (currentContent ? " " : "") + item.Content;
//         endTime = item.EndTime; // Update the end time
//       } else {
//         // Speaker has changed, save the previous segment
//         if (currentSpeaker !== null) {
//           finalTranscript.push({
//             speaker: currentSpeaker,
//             content: currentContent,
//             startTime: startTime,
//             endTime: endTime,
//             duration: endTime - startTime, // Calculate duration
//           });
//         }
//         // Update to new speaker
//         currentSpeaker = item.Speaker;
//         currentContent = item.Content;
//         startTime = item.StartTime; // Set the start time for the new speaker
//         endTime = item.EndTime; // Set the initial end time for the new speaker
//       }
//     } else if (item.Type === "punctuation") {
//       // Add punctuation to the current content
//       currentContent += item.Content;
//     }
//   });

//   // Push the last segment if any
//   if (currentSpeaker !== null && currentContent) {
//     finalTranscript.push({
//       speaker: currentSpeaker,
//       content: currentContent,
//       startTime: startTime,
//       endTime: endTime,
//       duration: endTime - startTime, // Calculate duration
//     });
//   }

//   const speakersList = Array.from(speakers);
//   return {
//     transcript,
//     speakers: speakersList,
//     finalTranscript,
//   };
// }

// const useMediaRecorder = (onDataAvailable, onStop) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const uploaderRef = useRef(null);
//   const chunkIndexRef = useRef(0);
//   const streamRef = useRef(null);
//   const accumulatedChunksRef = useRef([]);
//   const accumulatedSizeRef = useRef(0);
//   const { setUploading, uploading, setAnalyzing, analyzing } = useRecordingData();
//   const stoppingRef = useRef(false);

//   const transcriptionRef = useRef([]);
//   const processorNodeRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const sourceNodeRef = useRef(null);
//   const transcribeClientRef = useRef(null);

//   const getMimeType = () => {
//     const types = [
//       "audio/webm",
//       "audio/webm;codecs=opus",
//       "audio/ogg;codecs=opus",
//       "audio/mp4",
//     ];

//     for (const type of types) {
//       if (MediaRecorder.isTypeSupported(type)) {
//         return type;
//       }
//     }
//     return "audio/webm"; // fallback
//   };

//   const processAccumulatedChunks = async (force = false) => {
//     if (accumulatedChunksRef.current.length > 0) {
//       if (!force && accumulatedSizeRef.current >= CHUNK_SIZE) {
//         const blob = new Blob(accumulatedChunksRef.current, {
//           type: mediaRecorderRef.current.mimeType,
//         });
//         await uploaderRef.current.addChunk(
//           blob,
//           chunkIndexRef.current++,
//           false
//         );

//         accumulatedChunksRef.current = [];
//         accumulatedSizeRef.current = 0;
//       } else if (force) {
//         // On recording stop, upload accumulated chunks as final part
//         const blob = new Blob(accumulatedChunksRef.current, {
//           type: mediaRecorderRef.current.mimeType,
//         });
//         await uploaderRef.current.addChunk(blob, chunkIndexRef.current++, true);

//         accumulatedChunksRef.current = [];
//         accumulatedSizeRef.current = 0;
//       }
//     }
//   };

//   const stopAudioProcessing = () => {
//     // Disconnect and clean up audio nodes

//     if (processorNodeRef.current && sourceNodeRef.current) {
//       sourceNodeRef.current.disconnect(processorNodeRef.current);
//       processorNodeRef.current.disconnect(audioContextRef.current?.destination);
//     }

//     if (transcribeClientRef.current) {
//       transcribeClientRef.current.destroy();
//       transcribeClientRef.current = null;
//     }

//     // Close audio context
//     if (audioContextRef.current?.state !== "closed") {
//       audioContextRef.current?.close();
//     }

//     if (streamRef.current) {
//       // console.log("Stopping stream")
//       streamRef.current.getTracks().forEach((track) => track.stop());
//     } else {
//       console.log("No stream");
//     }
//     // Clear refs
//     processorNodeRef.current = null;
//     sourceNodeRef.current = null;
//     audioContextRef.current = null;
//   };

//   const startTranscription = async (stream) => {
//     transcribeClientRef.current = new TranscribeStreamingClient({
//       region: process.env.REACT_APP_AWS_REGION,
//       credentials: {
//         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//       },
//     });

//     // Create new audio context and nodes
//     audioContextRef.current = new AudioContext();
//     sourceNodeRef.current =
//       audioContextRef.current.createMediaStreamSource(stream);
//     processorNodeRef.current = audioContextRef.current.createScriptProcessor(
//       4096,
//       1,
//       1
//     );

//     const audioStream = async function* () {
//       while (true) {
//         const chunk = await new Promise((resolve) => {
//           processorNodeRef.current.onaudioprocess = (e) => {
//             const inputData = e.inputBuffer.getChannelData(0);
//             const pcmData = new Int16Array(inputData.length);
//             for (let i = 0; i < inputData.length; i++) {
//               pcmData[i] = inputData[i] * 0x7fff;
//             }
//             resolve(pcmData.buffer);
//           };
//         });
//         yield {
//           AudioEvent: {
//             AudioChunk: new Uint8Array(chunk),
//           },
//         };
//       }
//     };

//     // Connect the audio nodes
//     sourceNodeRef.current.connect(processorNodeRef.current);
//     processorNodeRef.current.connect(audioContextRef.current.destination);

//     const command = new StartStreamTranscriptionCommand({
//       LanguageCode: "en-US",
//       MediaSampleRateHertz: audioContextRef.current.sampleRate,
//       MediaEncoding: "pcm",
//       AudioStream: audioStream(),
//       Type: "CONVERSATION",
//       ShowSpeakerLabel: true,
//       MaxSpeakerLabels: 2,
//     });

//     try {
//       const response = await transcribeClientRef.current.send(command);

//       for await (const event of response.TranscriptResultStream) {
//         if (event.TranscriptEvent) {
//           const results = event.TranscriptEvent.Transcript.Results;

//           if (results.length > 0) {
//             // if (stoppingRef.current) {
//             //   console.log("Stopping :", stoppingRef.current);
//             // }

//             // if (!results?.[0]?.IsPartial && !stoppingRef.current) {
//               transcriptionRef.current = [
//                 ...transcriptionRef.current,
//                 {...results?.[0]}
//                 // { ...transformResults(results) },

//               ];
//               console.log("Transcript :", transformResults(results?.[0]));
//             // }
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error)
//       console.error("Transcription error:", error);
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;

//       // Create an AudioContext and necessary nodes

//       startTranscription(stream);

//       uploaderRef.current = new AudioUploader((progress) => {
//         if (onDataAvailable) {
//           onDataAvailable(progress);
//         }
//       });

//       mediaRecorderRef.current = new MediaRecorder(stream, {
//         mimeType: getMimeType(),
//         audioBitsPerSecond: 128000,
//       });

//       mediaRecorderRef.current.ondataavailable = async (e) => {
//         if (e.data.size > 0) {
//           accumulatedChunksRef.current.push(e.data);
//           accumulatedSizeRef.current += e.data.size;
//           await processAccumulatedChunks(false);
//         }
//       };

//       mediaRecorderRef.current.start(100); // Collect data every 100ms

//       setUploading(true);

//       setTimeout(() => {
//         setUploading(false);
//         setIsRecording(true);
//         setIsPaused(false);
//       }, 1500);

//       chunkIndexRef.current = 0;
//       accumulatedChunksRef.current = accumulatedChunksRef.current;
//       accumulatedSizeRef.current = 0;
//     } catch (error) {
//       console.error("Error accessing the microphone:", error);
//     }
//   };

//   const stopRecording = async () => {
//     if (mediaRecorderRef.current?.state !== "inactive") {
//       setIsRecording(false);
//       mediaRecorderRef.current?.stop();

//       stopAudioProcessing();

//       try {
//         setUploading(true);
//         setAnalyzing(true);
//         // Process any remaining chunks first
//         await processAccumulatedChunks(true);

//         const result = await uploaderRef.current.completeUpload();
//         if (onStop) {
          
//           console.log("Transcription1 :", transcriptionRef.current)
//           transcriptionRef.current = filterResults(transcriptionRef.current)
//           console.log("Transcription after filters :", transcriptionRef.current)
//           transcriptionRef.current = transcriptionRef.current.map((item) => {
//             return {...transformResults(item) };
//           });
//           onStop(result, transcriptionRef.current);
//         }
//       } catch (error) {
//         console.error("Error completing upload:", error);
//       } finally {
//       }

//       setIsRecording(false);
//       setIsPaused(false);

//       // Clean up transcription client

//       // Stop all audio processing

//       // // Stop all media tracks
//       // if (streamRef.current) {
//       //   streamRef.current.getTracks().forEach((track) => track.stop());

//       // }
//     } else {
//       setIsRecording(false);
//       setIsPaused(false);
//       try {
//         setUploading(true);
//         // Process any remaining chunks first
//         await processAccumulatedChunks(true);

//         const result = await uploaderRef.current.completeUpload();
//         if (onStop) {
//           // console.log("Transcription2 :", transcriptionRef.current)
//           transcriptionRef.current = filterResults(transcriptionRef.current)
//           // console.log("Transcription after filteres :", transcriptionRef.current)
//           transcriptionRef.current = transcriptionRef.current.map((item) => {
//             return {...transformResults(item) };
//           });
//           onStop(result, transcriptionRef.current);
//         }
//       } catch (error) {
//         console.error("Error completing upload:", error);
//       } finally {
//       }
//     }
//   };

//   const pauseRecording = () => {
//     mediaRecorderRef.current?.stop();
//     stopAudioProcessing();
//     setIsPaused(true);
//   };

//   const resumeRecording = async () => {
//     startRecording();
//     setIsPaused(false);
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (mediaRecorderRef.current?.state !== "inactive") {
//         mediaRecorderRef.current?.stop();
//       }
//       // Stop all media tracks
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       // Clean up audio processing
//       stopAudioProcessing();
//     };
//   }, []);

//   return {
//     isRecording,
//     isPaused,
//     startRecording,
//     stopRecording,
//     pauseRecording,
//     resumeRecording,
//     transcription: transcriptionRef.current,
//     stoppingRef,
//   };
// };

// export default useMediaRecorder;
