// import {
//     GetTranscriptionJobCommand,
//     StartTranscriptionJobCommand,
//     TranscribeClient
// } from "@aws-sdk/client-transcribe";

// export class AudioTranscriber {
//     constructor() {
//       this.transcribeClient = new TranscribeClient({
//         region: process.env.REACT_APP_AWS_REGION,
//         credentials: {
//           accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//           secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
//         }
//       });
//     }
  
//     async transcribeAudio(audioUrl, jobName) {
//       try {
//         // Start transcription job
//         const startCommand = new StartTranscriptionJobCommand({
//           TranscriptionJobName: jobName,
//           LanguageCode: "en-US", 
//           MediaFormat: "mp3", 
//           OutputBucketName: "dr.scribe",
//           OutputKey: "transcription/"+jobName+".json",
//           Media: {
//             MediaFileUri: audioUrl
//           },
//           Settings: {
//             ShowSpeakerLabels: true,
//             MaxSpeakerLabels: 2, 
//             ShowAlternatives: false
//           }
//         });
  
//         await this.transcribeClient.send(startCommand);
  
//         // Poll for completion
//         const result = await this.pollForCompletion(jobName);
//         return result;
  
//       } catch (error) {
//         console.error("Error starting transcription:", error);
//         throw error;
//       }
//     }
  
//     async pollForCompletion(jobName, maxAttempts = 60) {
//       return new Promise((resolve, reject) => {
//         let attempts = 0;
        
//         const checkStatus = async () => {
//           try {
//             const getCommand = new GetTranscriptionJobCommand({
//               TranscriptionJobName: jobName
//             });
  
//             const response = await this.transcribeClient.send(getCommand);
//             const status = response.TranscriptionJob.TranscriptionJobStatus;
  
//             if (status === "COMPLETED") {
//               // Get the transcript URL and fetch the results
//               const transcriptUrl = response.TranscriptionJob.Transcript.TranscriptFileUri;
             
//             //   const transcriptResponse = await fetch(transcriptUrl);
//             //   const transcriptData = await transcriptResponse.json();
//               resolve(transcriptUrl);
//             } else if (status === "FAILED") {
//               reject(new Error("Transcription job failed"));
//             } else if (attempts >= maxAttempts) {
//               reject(new Error("Timeout waiting for transcription"));
//             } else {
//               attempts++;
//               // Check again in 5 seconds
//               setTimeout(checkStatus, 5000);
//             }
//           } catch (error) {
//             reject(error);
//           }
//         };
  
//         checkStatus();
//       });
//     }
//   }