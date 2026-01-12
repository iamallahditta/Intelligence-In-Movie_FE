import React from 'react'
import useCurrentHash from '../../../hooks/useCurrentHash';

const Footer = () => {
  const {currentHash, setCurrentHash} = useCurrentHash();
  return (
    <div className="bg-navy_blue text-white py-12 px-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg tracking-wide font-semibold">AI Medical Website</h2>
          <p className="text-sm font-light my-5">Contact: +1234567890</p>
          <p className="text-sm font-light">Email: support@vocalli.ai</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a onClick={()=>{setCurrentHash('#home')}} href="#home" className={`font-semibold hover:underline ${currentHash !== '#home' ? 'text-white' : 'text-gray'}`}>Home</a>
          <a onClick={()=>{setCurrentHash('#benefits')}} href="#benefits" className={`font-semibold hover:underline ${currentHash !== '#benefits' ? 'text-white' : 'text-gray'}`}>Benefits</a>
          <a onClick={()=>{setCurrentHash('#about')}} href="#about" className={`font-semibold hover:underline ${currentHash !== '#about' ? 'text-white' : 'text-gray'}`}>About Us</a>
            <a onClick={()=>{setCurrentHash('#testimonials')}} href="#testimonials" className={`font-semibold hover:underline ${currentHash !== '#testimonials' ? 'text-white' : 'text-gray'}`}>Testimonials</a>
        </div>
      </div>
    </div>
  )
}

export default Footer