import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import LoginSchema from "../../utils/formSchema/login";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useToken from "../../hooks/auth/useToken";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/v1/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      const resData = response.data;

      if (resData?.user?.isAdmin) {
        toast.error(
          "Access denied. Administrative users are not permitted to log in here."
        );
        return;
      }

      if (!resData?.user?.verified) {
        const response = await axios.post("/v1/api/otp/send", {
          email: data.email,
          emailType: "verify",
        });
        toast.success(response.data.message);
        navigate("/verify-email", {
          state: { email: data.email },
        });
        return;
      }

      if (resData?.requires2fa) {
        toast.success("Sent Opt Successfully");
        navigate("/verify-2fa", {
          state: {
            email: data.email,
            twoFaEmail: resData.twoFaEmail,
            twoFaPhone: resData.twoFaPhone,
          },
        });
      } else {
        setToken(resData.token);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Oops! Couldn’t log you in. Try again.");
    } finally {
      localStorage.setItem("lastActivity", Date.now());
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
             <Link to="/" className="flex items-center justify-center">
              <img
                src="/vocalli-logo.png"
                alt="vocalli-logo"
                className="w-44 h-auto"
              />
            </Link>
            <h1 className="text-center text-3xl text-text_black font-bold tracking-wider">
              Log In
            </h1>

            <p className="text-center mb-2  text-text_black">Welcome Back!</p>

            <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                id="email"
                register={register}
                placeholder={"Email"}
                errors={errors}
              />
              <div className="flex flex-col">
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
                <Link
                  to="/forgot_password"
                  className="text-navy_blue ml-auto font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              disabled={isLoading}
              label={"Login"}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />
            </form>

            <div className="flex flex-row flex-wrap items-center justify-center mt-5 text-center gap-1">
              <span className="text-text_black text-sm sm:text-lg font-light">{`Don't have an account?`}</span>
              <Link
                to="/signup"
                className="text-navy_blue text-sm sm:text-lg font-semibold"
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

export default Login;
