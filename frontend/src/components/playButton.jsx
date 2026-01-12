import { FaPlay } from 'react-icons/fa6'
import React from 'react'

const PlayButton = ({isPlaying}) => {
  return (
    <div
     
      className={`relative ${isPlaying?"opacity-0":"opacity-100"} duration-300 flex items-center z-[99] cursor-pointer justify-center min-w-[50px] min-h-[50px]  rounded-full shadow-lg `}
    >
        <div className="z-20 w-12 h-12 bg-navy_blue rounded-full flex items-center justify-center cursor-pointer">
                <FaPlay className="text-white text-2xl" />
              </div>
       
   
      
      <div className="absolute z-[9] w-full h-full  bg-navy_blue bg-opacity-40 rounded-full animate-scaling"/>
      
    </div>
  )
}

export default PlayButton