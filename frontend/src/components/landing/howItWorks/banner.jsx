import React from "react";

const Banner = () => {
  return (
    <div
      id="home"
      className="max-w-[1440px] flex flex-col w-full  mx-auto relative"
    >
      <div className="flex flex-col md:flex-row items-center gap-4 px-1 lg:px-5 ">
        <div className="w-full h-full flex flex-col gap-2  p-2 lg:p-4 justify-center">
          <h1 className="text-navy_blue text-2xl font-bold">
            How Vocalli AI Works
          </h1>
          <h2 className="text-navy_blue font-semibold">
            Effortless Clinical Documentation with AI Precision.
          </h2>
          <p className="text-gray font-light">
            Vocalli AI is a groundbreaking AI-powered medical scribe that
            revolutionizes how healthcare professionals manage documentation. By
            listening to patient-provider conversations and leveraging ambient
            listening technology, Vocalli AI streamlines workflows and allows
            providers to focus on delivering exceptional care.
          </p>
        </div>
        <div className=" h-full ">
          <img
            src="/assets/howitworks/doctor.svg"
            alt="howItWorks"
            className="mx-auto object-cover h-[350px] w-[800px]"
          />
        </div>
      </div>
      <div className="flex items-center justify-center bg-navy_blue w-full p-5 mb-5">
        <h1 className="text-white text-sm font-semibold text-center">
          Vocalli AI delivers accuracy, speed, and efficiency—empowering
          healthcare professionals to spend less time documenting and more time
          with patients.
        </h1>
      </div>
      <div className="flex p-1 lg:p-5 ">
        <img
          src="/assets/howitworks/how.svg"
          alt="howItWorks"
          className="w-full h-[300px] object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
