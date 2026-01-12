import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa";
import { IoPause } from "react-icons/io5";
import { Oval } from "react-loader-spinner";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes < 10 ? `0${minutes}` : minutes}:${
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  }`;
};


const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const { t } = useTranslation();

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.readyState >= 3) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Error playing audio:", err));
      } else {
        setIsBuffering(true);
      }
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const startDragging = () => setIsDragging(true);
  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !audioUrl) return;

  // Pause and reset before setting new source
  audio.pause();
  setCurrentTime(0);
  setDuration(0);
  setIsPlaying(false);
  setIsBuffering(true);
  setIsAudioLoaded(false);

  audio.src = audioUrl;

  const onLoadedMetadata = () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    setDuration(audio.duration);
    setIsAudioLoaded(true);
    setIsBuffering(false);
  };

  const onTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const onWaiting = () => setIsBuffering(true);
  const onCanPlay = () => setIsBuffering(false);

  // Add listeners
  audio.addEventListener("loadedmetadata", onLoadedMetadata);
  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("waiting", onWaiting);
  audio.addEventListener("canplaythrough", onCanPlay);

  // Trigger loading
  audio.load();
  // Cleanup
  return () => {
    audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    audio.removeEventListener("timeupdate", onTimeUpdate);
    audio.removeEventListener("ended", onEnded);
    audio.removeEventListener("waiting", onWaiting);
    audio.removeEventListener("canplaythrough", onCanPlay);
  };
}, [audioUrl]);


  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && progressRef.current && audioRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
        audioRef.current.currentTime = Math.max(0, Math.min(duration, seekTime));
        setCurrentTime(seekTime);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  return (
    <div className="w-full p-1 bg-light_blue flex flex-col border-l-2 border-navy_blue">
      <audio ref={audioRef} preload="metadata" />

      <h1 className="text-xl mb-1">{t("note")}</h1>

      <div className="w-full flex flex-col items-center">
        <div className="flex items-center w-full gap-1">
          <div className="flex gap-2 items-center flex-shrink-0">
            <img
              onClick={skipBackward}
              className="cursor-pointer h-5"
              src="/assets/backward.svg"
              alt="backward"
            />
            {isBuffering ? (
              <Oval
                visible={true}
                height="24"
                width="24"
                color="#002366"
                secondaryColor="#fff"
                ariaLabel="oval-loading"
              />
            ) : (
              <div
                onClick={togglePlayPause}
                className="cursor-pointer w-6 h-6 rounded-full border-[3px] border-navy_blue flex items-center justify-center"
              >
                {isPlaying ? (
                  <IoPause className="text-sm" />
                ) : (
                  <FaPlay className="text-[10px] ml-[2px]" />
                )}
              </div>
            )}
            <img
              onClick={skipForward}
              className="cursor-pointer h-5"
              src="/assets/forward.svg"
              alt="forward"
            />
          </div>
          <img src="/assets/audio.svg" className="flex-grow" alt="waveform" />
        </div>

        <div className="flex justify-between w-full">
          <h1 className="text-gray text-[8px] mt-auto">
            {formatTime(currentTime)}
          </h1>
          <h1 className="text-gray text-[8px] mt-auto">
            {formatTime(duration)}
          </h1>
        </div>

        <div
          className="w-full h-2 bg-gray-400 rounded-full cursor-pointer"
          onMouseDown={startDragging}
          ref={progressRef}
          onClick={handleSeek}
        >
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
