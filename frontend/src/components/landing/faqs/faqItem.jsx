import React, { useState } from 'react'

import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoArrowDownCircleOutline } from 'react-icons/io5'

const FaqItem = ({item, index}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div key={index} className="border-b border-soft_gray py-5 px-2">
              
              <div
                  onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex flex-row items-center gap-3"
              >
                
                <div className="relative w-5 h-5">
                <FaPlus className={`${isOpen ? "opacity-0" : "opacity-100"} text-navy_blue absolute top-0 left-0 duration-300 w-5 h-5`} />
                <FaMinus className={`${isOpen ? "opacity-100" : "opacity-0"} text-navy_blue absolute top-0 left-0 duration-300 w-5 h-5`} />
                </div>
                <h3 className="font-semibold">{item.question}</h3>
             
              </div>
              <div className={`${isOpen ? "max-h-[100px] mt-2 overflow-y-scroll" : "max-h-[0px] mt-0 overflow-hidden"} no-scrollbar duration-300  h-full  flex flex-row  gap-2`}>
                
                <p className="ml-[20px] md:ml-[60px] lg:ml-[100px] mt-2 border-l-[2px] text-sm border-navy_blue pl-2 font-light">{item.answer}</p>
              </div>
            </div>
  )
}

export default FaqItem