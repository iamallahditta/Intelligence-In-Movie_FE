import React from "react";

const Benefits = () => {
  return (
    <div id='benefits' className="max-w-[1440px] w-full  mx-auto">
      <div className="flex justify-center items-center">
        <h1 className="text-center mx-auto  text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          Benefits
        </h1>
      </div>
      <div
        style={{
          backgroundImage: `url('/assets/benefits.svg')`,
        }}
        className="w-full h-[600px] my-5 grid grid-cols-1 md:grid-cols-2"
      >
        <div className="w-full h-full bg-transparent hidden md:block" />
        <div className="w-full h-full bg-black bg-opacity-80 flex gap-3 flex-col justify-center items-center">
          <h1 className="text-white text-xl font-semibold ">
            24/7 Virtual Assistance
          </h1>
          <h1 className="text-white  ">
            {" "}
            Always Available, Always Accurate
          </h1>
          <p className="text-white text-sm font-light w-[95%] md:w-[80%] xl:w-[50%]">
            Access your medical documentation platform anytime, anywhere. Vocalli AI works around your schedule, enabling seamless recording and transcription whether you're in the clinic, making rounds, or conducting telemedicine consultations.
          </p>
        </div>
        <div className="w-full h-full bg-black bg-opacity-80 flex gap-3 flex-col justify-center items-center">
          <h1 className="text-white text-xl font-semibold ">
            Personalized Treatment Plans
          </h1>
          <h1 className="text-white  ">
            {" "}
            Tailored Documentation for Every Specialty
          </h1>
          <p className="text-white text-sm font-light w-[95%] md:w-[80%] xl:w-[50%]">
            Customize templates and workflows to match your medical specialty and practice style. Vocalli AI adapts to your unique documentation needs, ensuring every patient record reflects your professional standards and clinical requirements.
          </p>
        </div>
        <div className="w-full h-full bg-transparent hidden md:block" />
      </div>
    </div>
  );
};

export default Benefits;
