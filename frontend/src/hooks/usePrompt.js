import { useState } from "react";
import { useBlocker } from "./useBlocker";

export const usePrompt = (shouldBlock) => {
  const [showModal, setShowModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);

  const blocker = (tx) => {
    setShowModal(true);
    setNextLocation(tx);
  };

  useBlocker(blocker, shouldBlock);

  const confirmLeave = () => {
    setShowModal(false);
    if (nextLocation) {
      // Add delay if needed to allow modal to unmount cleanly
      setTimeout(() => nextLocation.retry(), 100);
    }
  };

  const cancelLeave = () => {
    setShowModal(false);
    setNextLocation(null);
  };

  return { showModal, confirmLeave, cancelLeave };
};
