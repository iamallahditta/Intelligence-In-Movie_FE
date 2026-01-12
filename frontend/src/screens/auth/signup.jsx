import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import React, { useState } from "react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import { Link } from "react-router-dom";
import SignupSchema from "../../utils/formSchema/signup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import useToken from "../../hooks/auth/useToken";

const medicalOptions = [
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Dentistry",
  "Physical Therapy",
];

const specialities = {
  Medicine: [
    "Family Medicine",
    "Psychiatry",
    "Orthopedic",
    "Pediatric",
    "Obstetric (OB/GYN)",
    "Internal Medicine",
    "Surgery",
    "Cardiology",
    "Neurology",
    "Gastroenterology",
    "Others",
  ],
  Nursing: [
    "Critical Care",
    "Oncology",
    "Pediatric",
    "Psychiatric",
    "Surgery",
    "Others",
  ],
  Pharmacy: [
    "Clinical",
    "Retail",
    "Hospital",
    "Research",
    "Ambulatory Care",
    "Others",
  ],
  Dentistry: [
    "General",
    "Orthodontics",
    "Periodontics",
    "Oral Surgery",
    "Pediatric",
    "Others",
  ],
  "Physical Therapy": [
    "Orthopedic",
    "Neurological",
    "Pediatric",
    "Geriatric",
    "Sports",
    "Others",
  ],
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useToken();

  const [medicalField, setMedicalField] = useState("");
  const [speciality, setSpeciality] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      currentEMR: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/v1/api/auth/register", {
        username: data.name,
        email: data.email,
        password: data.password,
        ...(data.currentEMR && { currentEMR: data.currentEMR }),
        ...(medicalField && { medicalField }),
        ...(speciality && { speciality }),
      });

      console.log(response.data);

      if (response.data.success) {
        const response = await axios.post("/v1/api/otp/send", {
          email: data.email,
          emailType: "verify",
        });

        toast.success(response.data.message);
        // setToken(response.data.token);
        navigate("/verify-email", {
          state: { email: data.email },
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
    setIsLoading(false);
  };

  const filteredSpecialities = medicalField ? specialities[medicalField] : [];
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
    
      <div className="w-full flex-grow pb-10 flex items-center justify-center z-10">
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
              Sign Up
            </h1>

            <p className="text-center mb-2  text-text_black">
              Create Your Account!
            </p>

            <div>
              <Input
                id="name"
                register={register}
                placeholder={"Name"}
                errors={errors}
              />

              <Input
                id="email"
                register={register}
                placeholder={"Email"}
                errors={errors}
              />

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

              <Input
                id="currentEMR"
                register={register}
                placeholder={"Current EMR"}
                errors={errors}
              />

              <CustomSelect
                id="medicalField"
                placeholder="Medical Field"
                options={medicalOptions}
                value={medicalField}
                onChange={(e) => {
                  setMedicalField(e.target.value);
                  setSpeciality("");
                }}
                errors={errors}
              />

              <CustomSelect
                id="speciality"
                placeholder="Speciality"
                options={filteredSpecialities}
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                disabled={!medicalField}
                errors={errors}
              />
            </div>

            <div className="text-center text-sm text-text_black font-light mt-2">
              <span>By signing up, you agree to our </span>
              <Link
                to="/terms"
                className="text-navy_blue font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>
              <span> and </span>
              <Link
                to="/privacy"
                className="text-navy_blue font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
              <span>.</span>
            </div>

            <Button
              label={"Sign up"}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />

            <div className="flex flex-row flex-wrap items-center justify-center mt-1 text-center gap-1">
              <span className="text-text_black text-xs sm:text-sm font-light">Already have an account?</span>
              <Link
                to="/login"
                className="text-navy_blue text-xs sm:text-sm font-semibold"
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

export default Signup;
