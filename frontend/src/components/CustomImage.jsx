import React from 'react';
import { useState } from 'react';

const CustomImage = ({ image, image_min }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
  return (
    <div
      style={{
        backgroundImage: `url(${image_min})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: imageLoaded ? "blur(0px)" : "blur(10px)",
        transition: "filter 0.2s ease-in-out",
      }}
      className="w-full h-full"
    >
      <img
        src={image}
        onLoad={() => setImageLoaded(true)}
        loading="eager"
        className={`w-full h-full  object-cover duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default CustomImage; 