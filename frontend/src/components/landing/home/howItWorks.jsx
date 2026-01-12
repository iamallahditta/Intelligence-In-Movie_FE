import React, { useState } from "react";

import Button from "../../Button";
import { FaFileMedicalAlt } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import PlayButton from "../../playButton";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "1",
    title: "Listen Conversation",
    description: "Real-time audio recording of doctor-patient conversations with advanced noise cancellation.",
    Icon: <FaMicrophoneAlt className="text-gray text-2xl" />,
  },
  {
    id: "2",
    title: "Streamlines Medical Processes",
    description: "Automates documentation workflows, reducing administrative time by up to 70%.",
    Icon: <FaUserGroup className="text-gray text-2xl" />,
  },
  {
    id: "3",
    title: "Assembles Medical History Records",
    description: "Automatically organizes and structures patient history for quick reference and analysis.",
    Icon: <FaFileMedicalAlt className="text-gray text-2xl" />,
  },
  {
    id: "4",
    title: "Conversation Summary",
    description: "AI-generated summaries capturing key diagnoses, symptoms, and treatment plans.",
    Icon: <IoDocumentText className="text-gray text-2xl" />,
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideoPlayback = () => {
    const video = document.getElementById("howItWorksVideo");
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const [isPlaying2, setIsPlaying2] = useState(false);
  const toggleVideoPlayback2 = () => {
    const video = document.getElementById("howItWorksVideo2");
    if (video.paused) {
      video.play();
      setIsPlaying2(true);
    } else {
      video.pause();
      setIsPlaying2(false);
    }
  };

  return (
    <div className={`max-w-[1440px] w-full mt-5 mx-auto`}>
      <div className="w-[95%] sm:2-[90%] lg:w-[75%] mx-auto  flex flex-col items-center justify-center mb-10">
        <h1 className="text-center text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          How AI Medical Works
        </h1>
        <h2 className="text-center font-semibold text-black tracking-wide my-5">
          Effortless Clinical Documentation with AI Precision
        </h2>
        <p className="text-center  text-gray font-light  ">
          Vocalli AI transforms the way healthcare professionals document patient encounters. Our intelligent platform listens, transcribes, and organizes medical conversations in real-time, allowing doctors to focus on what matters most—patient care. With advanced AI technology, we convert hours of documentation work into minutes of effortless automation.
        </p>
        <div className="mt-5 w-[150px]">
          <Button onClick={() => { navigate("/how_it_works") }} label={"Learn More"} />
        </div>
      </div>

      <div className="w-[95%] sm:2-[90%] lg:w-[75%] mx-auto  flex flex-col items-center justify-center ">
        <h1 className="text-center text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          AI Medical in Action
        </h1>
        <p className="text-center  text-gray font-light mt-5">
          See how Vocalli AI seamlessly integrates into your clinical workflow to deliver accurate, comprehensive medical documentation.
        </p>
      </div>
      <div className="grid  grid-cols-2 md:grid-cols-4 mt-10 mb-5 gap-5">
        {actions.map((action) => (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-[1px] border-gray rounded-full flex items-center justify-center">
              {action?.Icon}
            </div>
            <h1 className="text-black  font-medium  text-center">
              {action?.title}
            </h1>
            <p className="text-gray text-sm font-light text-center">
              {action?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
