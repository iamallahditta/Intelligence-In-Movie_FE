import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen overflow-y-scroll flex flex-col items-center justify-center bg-white">
      <img
        src="/assets/anime.svg"
        className="absolute top-0 right-0 w-[80%] xl:w-[40%]"
      />
      <img
        src="/assets/anime_bottom.svg"
        className="absolute bottom-0 left-0 w-[80%] xl:w-[40%]"
      />
      <div className="p-4 mr-auto">
        <img className="w-[120px]" src="/vocalli-logo.png" />
      </div>
      <div className="w-full flex-grow pb-10 flex items-center justify-center">
        <div className="w-[96%] md:w-[70%] lg:w-[60%] xl:w-[40%] px-5 py-10 shadow-sm flex flex-col items-center rounded-lg bg-light_gray">
          <div className="w-[95%] md:w-[90%] lg:w-[90%] xl:w-[80%] flex flex-col items-center gap-4">
            <div className="animate-spin w-12 h-12 border-4 border-navy_blue border-t-transparent rounded-full" />
            <h1 className="text-center text-xl text-text_black font-medium tracking-wider">
              Loading...
            </h1>
            <p className="text-center text-gray">Please wait while we process your request</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 