import CustomImage from '../../CustomImage'
import React from 'react'
import { useNavigate } from 'react-router-dom';
const Banner = () => {
    const navigate = useNavigate();
  return (
    <div id='home' className='max-w-[1440px] w-full h-[250px] sm:h-[300px] lg:h-[400px] xl:h-[500px]  mx-auto relative'>
        <div className='absolute top-0 left-0 w-full h-full  z-[8]'>
            {/* <CustomImage image={"/assets/banner.svg"} image_min={"/assets/banner_min.jpeg"} /> */}
        <img src="/assets/banner.svg" alt="banner" className='w-full h-full object-cover' />
        </div>
        <div className='absolute top-0 flex justify-center items-center left-0 w-full h-full  z-[9]'>
       
        <div className='w-[90%] sm:w-[60%]   '>
            <div className="inline-block  text-center space-y-2 sm:space-y-3 lg:space-y-4  ">
            <h1 className='font-wallpoet text-3xl text-white'>
            Medical
            </h1>
            <h1 className="text-center text-white font-semibold text-[28px] tracking-wider">Healthcare With AI</h1>
            <p className='text-white font-light text-sm'>
            Access your past recordings & <br/> monitor your progress
            </p>

            <div onClick={()=>{navigate("/signup")}} className='flex justify-center items-center p-2 cursor-pointer bg-white rounded-xl w-[120px] mx-auto' >
    <p className="text-navy_blue font-semibold">Get Started</p>
            </div>
            </div>
      
        </div>
        </div>
    
    </div>
  )
}

export default Banner