import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import React, { useState } from "react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { Link } from "react-router-dom";
// import SignupSchema from "../../utils/formSchema/signup";
import axios from "axios";
import { resetPasswordSchema } from "../../utils/formSchema/password";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        toast.error("Email not found. Please try again");
        navigate("/forgot_password");
        return;
      }

      const response = await axios.post("/v1/api/auth/reset-password", {
        email: email,
        password: data.password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.removeItem("resetEmail"); // Clean up
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
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
      <div className="   p-4 mr-auto">
        <img className="w-[120px]" src="/vocalli-logo.png" alt="" />
      </div>
      <div className="w-full flex-grow pb-10 flex items-center justify-center  ">
        <div className="w-[96%] md:w-[70%] lg:w-[60%] xl:w-[40%]   px-5 py-10 shadow-sm flex flex-col items-center   rounded-lg bg-light_gray">
          <div className="w-[95%] md:w-[90%] lg:w-[90%] xl:w-[80%] flex flex-col gap-4">
            <h1 className="text-center text-3xl text-text_black font-bold tracking-wider">
              Reset Password
            </h1>

            <p className="text-center mb-2  text-text_black">
              Create a new password to secure your account.
            </p>

            <div>
              <Input
                id="password"
                register={register}
                placeholder={"Password"}
                errors={errors}
                type={showPassword ? "text" : "password"}
                RightIcon={() => (
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer "
                  >
                    {!showPassword ? (
                      <IoEyeOffOutline className="text-xl" />
                    ) : (
                      <IoEyeOutline className="text-xl" />
                    )}
                  </div>
                )}
              />

              <Input
                id="confirm_password"
                register={register}
                placeholder={"Confirm Password"}
                errors={errors}
                type={showConfirmPassword ? "text" : "password"}
                RightIcon={() => (
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer "
                  >
                    {!showConfirmPassword ? (
                      <IoEyeOffOutline className="text-xl" />
                    ) : (
                      <IoEyeOutline className="text-xl" />
                    )}
                  </div>
                )}
              />
            </div>
            <Button
              label={"Update Password"}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />

            <div className="flex flex-row items-center justify-center mt-5">
              <h1 className="text-text_black text-lg font-light">{`Remember Password?`}</h1>
              <Link
                to="/login"
                className="text-navy_blue ml-2 text-lg font-semibold"
              >
                Login Here!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
