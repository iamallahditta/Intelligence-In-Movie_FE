import React, { useEffect, useRef, useState } from "react";

let currentOTPIndex = 0;
const OtpInput = ({setOtp, otp}) => {
 
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  const inputRef = useRef(null);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp('otp',newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <div className={" flex justify-center items-center space-x-1 md:space-x-4"}>
      {otp.map((_, index) => {
        return (
          <React.Fragment key={index}>
            <input
              ref={activeOTPIndex === index ? inputRef : null}
              className={
                "w-12 h-14 border-b-2 rounded-none bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-stroke_gray focus:border-black focus:text-black text-stroke_gray transition"
              }
              onChange={handleOnChange}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              value={otp[index]}
            />
            
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OtpInput;
