import React, { useState } from "react";

import { FaFileMedicalAlt } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import PlayButton from "../../playButton";

const actions=[
    {
        id:"1",
        title:"Listen Conversation",
        description:"Real-time audio recording of doctor-patient conversations with advanced noise cancellation.",
        Icon:<FaMicrophoneAlt className="text-gray text-2xl"/>
    },
    {
        id:"2",
        title:"Streamlines Medical Processes",
        description:"Automates documentation workflows, reducing administrative time by up to 70%.",
        Icon:<FaUserGroup className="text-gray text-2xl"/>
    },
    {
        id:"3",
        title:"Assembles Medical History Records",
        description:"Automatically organizes and structures patient history for quick reference and analysis.",
        Icon:<FaFileMedicalAlt className="text-gray text-2xl"/>
    },
    {
        id:"4",
        title:"Conversation Summary",
        description:"AI-generated summaries capturing key diagnoses, symptoms, and treatment plans.",
        Icon:<IoDocumentText className="text-gray text-2xl"/>
    }
]

const HowItWorks = () => {
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
      <div className="w-[95%] sm:2-[90%] lg:w-[75%] mx-auto  flex flex-col items-center justify-center ">
        <h1 className="text-center text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          How AI Medical Works
        </h1>
        <p className="text-center  text-gray font-light mt-5">
          Vocalli AI transforms the way healthcare professionals document patient encounters. Our intelligent platform listens, transcribes, and organizes medical conversations in real-time, allowing doctors to focus on what matters most—patient care. With advanced AI technology, we convert hours of documentation work into minutes of effortless automation.
        </p>
      </div>
      <div className="flex flex-col mx-2 sm:mx-5 lg:mx-10 items-center my-5">
        <div className="flex flex-col md:flex-row items-center bg-[#FAFAFA] my-4 mx-auto">
          <div className="md:w-[55%] w-full  relative overflow-hidden">
            <video
              id="howItWorksVideo"
              className="w-full rounded-xl overflow-hidden"
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="/assets/thumbnail2.png"
              controls={false}
            />

            <div
              className={`absolute inset-0 flex items-center rounded-xl  justify-center  text-white text-xl`}
              onClick={toggleVideoPlayback}
            >
              <PlayButton isPlaying={isPlaying} />
            </div>
          </div>
          <div className=" md:w-[45%] w-full p-4">
            <h1 className="text-2xl font-medium text-black mb-4">
              AI-Powered Transcription{" "}
            </h1>
            <p className="text-gray text-sm  font-light">
              Vocalli AI seamlessly integrates into your clinical workflow, capturing every detail of patient encounters without disrupting your practice. Our advanced speech recognition technology accurately transcribes medical terminology, symptoms, and treatment plans in real-time.
              <br />
              The platform automatically structures conversations into comprehensive medical notes, complete with SOAP format, ICD codes, and treatment recommendations. Healthcare professionals save an average of 2-3 hours daily on documentation, allowing more time for patient care and reducing burnout. With cloud-based access and enterprise-grade security, your patient data remains protected while being accessible whenever and wherever you need it.{" "}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center bg-[#FAFAFA] my-4 mx-auto">
          <div className="md:w-[45%] w-full p-4">
            <h1 className="text-2xl font-medium text-black mb-4">
              Intelligent Documentation{" "}
            </h1>
            <p className="text-gray text-sm  font-light">
              Experience the future of medical documentation with Vocalli AI's intelligent automation. Our platform leverages cutting-edge natural language processing to understand medical context, extract key information, and generate structured clinical notes automatically.
              <br />
              The system learns from your documentation style and preferences, adapting to your specialty and workflow. Whether you're a primary care physician, specialist, or surgeon, Vocalli AI customizes templates and formats to match your needs. Export notes in multiple formats including PDF, DOCX, and integrate seamlessly with popular EHR systems. Focus on your patients while we handle the paperwork.{" "}
            </p>
          </div>

          <div className="md:w-[55%] w-full  relative overflow-hidden">
            <video
              id="howItWorksVideo2"
              className="w-full rounded-xl overflow-hidden"
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="/assets/thumbnail1.png"
              controls={false}
            />

            <div
              className={`absolute inset-0 flex items-center rounded-xl  justify-center  text-white text-xl`}
              onClick={toggleVideoPlayback2}
            >
              <PlayButton isPlaying={isPlaying2} />
            </div>
          </div>
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
        {actions.map((action )=> <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-[1px] border-gray rounded-full flex items-center justify-center">
            {action?.Icon}
          </div>
          <h1 className="text-black  font-medium  text-center">{action?.title}</h1>
          <p className="text-gray text-sm font-light text-center">
            {action?.description}
          </p>
        </div>)}
      </div>
    </div>
  );
};

export default HowItWorks;
