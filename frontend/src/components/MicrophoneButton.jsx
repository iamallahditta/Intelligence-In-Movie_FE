import { MagnifyingGlass, RotatingLines } from "react-loader-spinner";

import { HiOutlineMicrophone } from "react-icons/hi2";
import React from "react";

const MicrophoneButton = ({ onClick, isRecording, uploading, analyzing }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center z-[99] cursor-pointer justify-center duration-300 min-w-[120px] min-h-[120px]  rounded-full shadow-lg `}
    >
      <div
        className="w-[85%] h-[85%] absolute  bg-[#E1E7F3]  z-20 rounded-full flex items-center justify-center"
        style={{ backdropFilter: "none" }}
      >
        {uploading && analyzing ? (
          <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#0058FF"
          />
        ) : uploading ? (
          <RotatingLines
            visible={true}
            height="50"
            width="50"
            color="#0058FF"
            strokeColor="#0058FF"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <HiOutlineMicrophone className="text-4xl text-[#0058FF]" />
        )}
      </div>
      <div
        className={`absolute z-[10] w-full h-full bg-[#E1E7F3] shadow-lg rounded-full flex items-center justify-center blur-[2px]`}
        style={{ backdropFilter: "blur(2px)" }}
      />
      <div
        className={`${
          isRecording && !uploading ? "bg-light_blue" : "bg-transparent"
        } absolute z-[9] w-full h-full   rounded-full animate-scaling`}
      />
      <div
        className={`${
          isRecording && !uploading ? "bg-[#0058FF]" : "bg-transparent"
        } absolute bottom-0 z-[8] w-full h-full   rounded-full animate-scaling2`}
      />
    </div>
  );
};

export default MicrophoneButton;
