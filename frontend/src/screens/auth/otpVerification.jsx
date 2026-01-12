import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import LoginSchema from "../../utils/formSchema/login";
import OtpInput from "../../components/otpInput";
import axios from "axios";
import { otpSchema } from "../../utils/formSchema/password";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const OtpVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(otpSchema),
  });

  const otp = watch("otp", new Array(6).fill(""));
  console.log(otp);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        toast.error("Email not found. Please try again");
        navigate("/forgot_password");
        return;
      }

      const response = await axios.post(
        "/v1/api/otp/verify",
        {
          email: email,
          otp: data.otp.join(""), // Convert OTP array to string
        },
        {
          params: {
            token: false, // We don't need a token for password reset flow
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/reset_password");
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        toast.error("Email not found. Please try again");
        navigate("/forgot_password");
        return;
      }

      const response = await axios.post("/v1/api/otp/send", {
        email: email,
        emailType: "reset",
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-scroll  flex flex-col items-center bg-white   ">
      <img
        src="/assets/anime.svg"
        className="absolute top-0 right-0 w-[80%] xl:w-[40%]"
      />
      <img
        src="/assets/anime_bottom.svg"
        className="absolute bottom-0 left-0 w-[80%] xl:w-[40%]"
      />
      
      <div className="w-full flex-grow pb-10 flex items-center justify-center  ">
        <div className="w-[96%] md:w-[70%] lg:w-[60%] xl:w-[40%]   px-5 py-10 shadow-sm flex flex-col items-center   rounded-lg bg-light_gray">
           <div className="flex items-center justify-center">
              <img
                src="/vocalli-logo.png"
                alt="vocalli-logo"
                className="w-44 h-auto"
              />
            </div>
          <div className="w-[95%] md:w-[90%] lg:w-[90%] xl:w-[80%] flex flex-col gap-4">
            <h1 className="text-center text-3xl text-text_black font-bold tracking-wider">
              Verification Code
            </h1>

            <p className="text-center mb-2  text-text_black">
              Enter the 6-digit code we’ve sent to your email.
            </p>

            <OtpInput setOtp={setValue} otp={otp} />
            {errors?.["otp"] && (
              <p className="text-rose-500 ">{`${errors["otp"]?.message}`}</p>
            )}

            <Button
              label={"Submit"}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />

            <div className="flex flex-row items-center justify-center mt-5">
              <h1 className="text-text_black text-lg font-light">{`Didn't get code?`}</h1>
              <h1
                onClick={handleResendOtp}
                className={`cursor-pointer text-navy_blue ml-2 text-lg font-semibold ${
                  isResending ? "opacity-50" : ""
                }`}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
