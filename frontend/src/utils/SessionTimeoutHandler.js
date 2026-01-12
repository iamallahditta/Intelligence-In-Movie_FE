

// // src/utils/SessionTimeoutHandler.js
// import { useEffect, useRef } from "react";

// // production
// const INACTIVITY_LIMIT = 1 * 60 * 60 * 1000; // 1 hour in ms
// const WARNING_BEFORE = 5 * 60 * 1000; // Warn 5 minutes before logout

// // testing
// // const INACTIVITY_LIMIT = 30 * 1000;
// // const WARNING_BEFORE = 15 * 1000;

// export default function useSessionTimeout(onLogout, onWarnUser) {
//   const timeoutRef = useRef(null);
//   const warningTimeoutRef = useRef(null);

//   const resetTimer = () => {
//     clearTimeout(timeoutRef.current);
//     clearTimeout(warningTimeoutRef.current);

//     const now = Date.now();
//     localStorage.setItem("lastActivity", now);

//     warningTimeoutRef.current = setTimeout(() => {
//       onWarnUser && onWarnUser();
//     }, INACTIVITY_LIMIT - WARNING_BEFORE);

//     timeoutRef.current = setTimeout(() => {
//       onLogout();
//     }, INACTIVITY_LIMIT);
//   };

//   const handleUserActivity = () => {
//     resetTimer();
//   };

//   useEffect(() => {
//     const lastActivity = parseInt(localStorage.getItem("lastActivity"), 10);
//     const now = Date.now();

//     // If expired while the tab was closed
//     if (lastActivity && now - lastActivity > INACTIVITY_LIMIT) {
//       onLogout();
//       return;
//     }

//     // Set listeners and timers
//     window.addEventListener("mousemove", handleUserActivity);
//     window.addEventListener("keydown", handleUserActivity);

//     resetTimer();

//     return () => {
//       window.removeEventListener("mousemove", handleUserActivity);
//       window.removeEventListener("keydown", handleUserActivity);
//       clearTimeout(timeoutRef.current);
//       clearTimeout(warningTimeoutRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       localStorage.setItem("lastActivity", Date.now());
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);
// }


import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT = 1 * 60 * 60 * 1000; // 1 hour
const WARNING_BEFORE = 5 * 60 * 1000; // Warn 5 minutes before logout

export default function useSessionTimeout(onLogout, onWarnUser) {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // 🧠 Reset inactivity timers
  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningTimeoutRef.current);

    const now = Date.now();
    localStorage.setItem("lastActivity", now);

    warningTimeoutRef.current = setTimeout(() => {
      onWarnUser && onWarnUser();
    }, INACTIVITY_LIMIT - WARNING_BEFORE);

    timeoutRef.current = setTimeout(() => {
      onLogout();
    }, INACTIVITY_LIMIT);
  };

  // 🔄 Handle user activity
  const handleUserActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    const now = Date.now();
    const lastActivity = parseInt(localStorage.getItem("lastActivity"), 10);

    // ⏰ If user reopens site after timeout period, log them out
    if (lastActivity && now - lastActivity > INACTIVITY_LIMIT) {
      onLogout();
      return;
    }

    // 🖱️ Listen for activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // 🕓 Start the timers
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      clearTimeout(timeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  // 💾 Persist last activity before closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastActivity", Date.now());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 🧩 Listen for activity or logout from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "lastActivity") {
        const lastActivity = parseInt(localStorage.getItem("lastActivity"), 10);
        const now = Date.now();

        if (now - lastActivity > INACTIVITY_LIMIT) {
          onLogout(); // Logout across all tabs
        } else {
          resetTimer(); // Reset in all tabs
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
}
