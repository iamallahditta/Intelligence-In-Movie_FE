// import { useEffect, useState } from 'react';

// import { io } from 'socket.io-client';

// const useSocket = (url , setTranscription) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const socketInstance = io(url);

//     socketInstance.on('connect', () => {
//       console.log('Socket connected');
//     });

//     socketInstance.on('transcription', (transcript) => {
//       setTranscription(transcript);
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [url]);

//   return socket;
// };

// export default useSocket;



import { useEffect, useRef } from 'react';
import { io } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef(null);

  const connect = () => {
    if (!socketRef.current) {
      socketRef.current = io(
        process.env.REACT_APP_API_URL,
        {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: false, // We'll connect manually
        }
      );
    }
    socketRef.current.connect();
    return socketRef.current;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      disconnect(); // Cleanup on unmount
    };
  }, []);

  return { socket: socketRef.current, connect, disconnect };
};