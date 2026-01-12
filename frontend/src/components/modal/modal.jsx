"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

// import Button from "../Button";
import { IoMdClose } from "react-icons/io";

const Modal = forwardRef(({ isOpen, onClose, closeClass, body }, ref) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useImperativeHandle(ref, () => ({ handleClose }));

  if (!isOpen) return null;

  return (
    <div
      className="
  justify-center
  items-center
  flex
  overflow-x-hidden
  overflow-y-auto
 fixed
  inset-0
 
  z-[100]
 outline-none
  focus:outline-none
  bg-neutral-800/70
 
  "
    >
      <div
        className="
        relative
        w-[calc(100%-2rem)]
        md:w-4/6
        lg:w-3/6
        xl:w-2/5
        my-6
        mx-auto
        h-auto
        
        
       
        "
      >
        {/* CONTENT */}
        <div
          className={`
         transition-all
        duration-300
        ease-in-out
        h-full
       
        ${showModal ? "scale-100" : "scale-95"}
        ${showModal ? "opacity-100" : "opacity-0"}

        `}
        >
          <div
            className={`
            transition-all
            h-full
            lg:h-auto
md:h-auto
border-0
rounded-lg
shadow-lg
relative 
flex
flex-col
w-full
bg-white
outline-none
focus:outline-none

            `}
          >
            {/* HEADER */}

            <button
              onClick={handleClose}
              className={`
                absolute
                
                border-0
                hover-opacity-70
                transition
                
                z-[9]
                w-6
                h-6
                bg-pink
                rounded-full 
                flex 
                items-center
                justify-center

                ${closeClass}
                `}
            >
              <IoMdClose className="text-white text-xl" />
            </button>

            <div className="p-4 relative flex-auto">{body}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Modal;
