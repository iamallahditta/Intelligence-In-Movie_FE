import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Button from "../../components/Button";
import Input from "../../components/Input";
// import { IoEyeOffOutline } from "react-icons/io5";
// import { IoEyeOutline } from "react-icons/io5";
import axios from "axios";
import { forgotPasswordSchema } from "../../utils/formSchema/password";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/v1/api/otp/send", {
        email: data.email,
        emailType: "reset",
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("resetEmail", data.email);
        navigate("/otp_verification");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-scroll  flex flex-col items-center bg-white   ">
      <img
        src="/assets/anime.svg"
        className="absolute top-0 right-0 w-[80%] xl:w-[40%]"
        alt=""
      />
      <img
        src="/assets/anime_bottom.svg"
        className="absolute bottom-0 left-0 w-[80%] xl:w-[40%]"
        alt=""
      />

      <div className="w-full flex-grow pb-10 flex items-center justify-center  ">
        <div className="w-[96%] md:w-[70%] lg:w-[60%] xl:w-[40%]   px-5 py-10 shadow-sm flex flex-col items-center   rounded-lg bg-light_gray">
          <div className="w-[95%] md:w-[90%] lg:w-[90%] xl:w-[80%] flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <img
                src="/vocalli-logo.png"
                alt="vocalli-logo"
                className="w-44 h-auto"
              />
            </div>

            <h1 className="text-center text-3xl text-text_black font-bold tracking-wider">
              Forgot Password
            </h1>

            <p className="text-center mb-2  text-text_black">
              Enter your email to receive a password reset link.
            </p>

            <Input
              id="email"
              register={register}
              placeholder={"Email"}
              errors={errors}
            />

            <Button
              label={"Submit"}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />

            <div className="flex flex-row items-center justify-center mt-5">
              <h1 className="text-text_black text-lg font-light">{`Don't have an account?`}</h1>
              <Link
                to="/signup"
                className="text-navy_blue ml-2 text-lg font-semibold"
              >
                Sign Up Here!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
