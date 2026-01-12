import { useEffect, useRef, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

import { HiMiniPencil } from "react-icons/hi2";
import Button from "../../components/Button";
// import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
// import { ImageUploader } from "../../utils/uploadImage";
import Input from "../../components/Input";
// import { S3Deleter } from "../../utils/deleteFromS3";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import SignatureCanvas from "../../components/SignatureCanvas";
import useUser from "../../hooks/auth/useUser";
import updateSchema from "../../utils/formSchema/update";
import PhoneInput from "react-phone-input-2";

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

const Profile = () => {
  const { user, setUser } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Signature

  const sigPadRef = useRef(null);
  const [signature, setSignature] = useState(null);
  const [medicalField, setMedicalField] = useState("");
  const [speciality, setSpeciality] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,

    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.username || "",
      email: user?.email || "",
      password: "",
      phone: user?.phone || "",
      currentEMR: user?.currentEMR || "",
    },
    resolver: zodResolver(updateSchema),
  });

  const phone = watch("phone");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let dataTemp = {};
      dataTemp.username = data.name;
      dataTemp.currentEMR = data.currentEMR;
      dataTemp.medicalField = medicalField;
      dataTemp.speciality = speciality;
      dataTemp.phone = phone;

      if (data.password?.length > 0) {
        dataTemp.password = data.password;
      }

      if (!sigPadRef?.current?.isEmpty()) {
        const signatureData = sigPadRef?.current?.toDataURL();
        dataTemp.signature = signatureData;
      }

      if (!signature && sigPadRef?.current?.isEmpty()) {
        dataTemp.signature = "";
      }

      const response = await axios.put("/v1/api/users", dataTemp);

      if (response.data) {
        setUser(response.data.updatedUser);
        reset({
          name: response.data.updatedUser.username,
          email: response.data.updatedUser.email,
          password: "",
          phone: response.data.updatedUser.phone || "",
          currentEMR: response.data.updatedUser.currentEMR || "",
        });
        setMedicalField(response.data.updatedUser.medicalField || "");
        setSpeciality(response.data.updatedUser.speciality || "");

        toast.success("Profile updated successfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large. Maximum size is 3 MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setIsUploading(true);
    try {
      if (user.imageUrl) {
        const urlParts = user.imageUrl.split("/");
        const fileNameWithExtension = urlParts[urlParts.length - 1];

        await axios
          .delete(`/v1/api/image/${fileNameWithExtension}`)
          .catch((err) => {
            console.error("Error deleting image file:", err);
          });
      }

      const formData = new FormData();
      formData.append("image", file);

      // Send the image to the backend for uploading
      const uploadResponse = await axios.post(
        "/v1/api/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the result from the upload response
      const { url, id } = uploadResponse.data;

      // Now update the user profile with the new image
      const response = await axios.put("/v1/api/users", {
        image: { id, url },
      });

      if (response.data) {
        setUser(response.data.updatedUser);
        toast.success("Profile image updated successfully");
      }
    } catch (error) {
      setPreview(null);
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setSignature(user?.signature);
      setMedicalField(user?.medicalField || "");
      setSpeciality(user?.speciality || "");
      setValue("phone", user?.phone || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredSpecialities = medicalField ? specialities[medicalField] : [];

  return (
    <div className="w-full h-full overflow-y-scroll flex-grow  no-scrollbar px-4 py-10">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full lg:w-auto flex flex-col gap-2 items-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white overflow-hidden p-2 shadow-custom">
            <img
              className="w-full h-full object-cover rounded-full"
              src={
                preview ??
                user?.imageUrl ??
                "https://www.londondentalsmiles.co.uk/wp-content/uploads/2017/06/person-dummy.jpg"
              }
              alt=""
            />
          </div>
          <div className="w-full max-w-[150px] mt-2">
            <Button
              label={"Edit"}
              IconLeft={() => <HiMiniPencil />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            />
          </div>
        </div>
        <div className="flex flex-col flex-grow w-full lg:mx-[5%] xl:mx-[10%]">
          <h1 className="text-2xl font-semibold tracking-wide mt-5">
            My Profile
          </h1>

          <div className="flex flex-col mt-5">
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
              disabled={true}
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
              id="currentEMR"
              register={register}
              placeholder={"Current EMR"}
              errors={errors}
            />

            <div className="p-2 py-3 flex flex-row items-center form-input w-full border-soft_gray border-b-[1.5px] border-slate_blue mb-4">
              <select
                value={medicalField}
                onChange={(e) => {
                  setMedicalField(e.target.value);
                  setSpeciality("");
                }}
                className={`w-full outline-none bg-transparent mx-1 cursor-pointer ${
                  !medicalField ? "text-[#9CA3AF]" : "text-text_black"
                }`}
              >
                <option value="">Medical Field</option>
                {medicalOptions.map((fields) => (
                  <option
                    key={fields}
                    value={fields}
                    className="text-text_black"
                  >
                    {fields}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2 py-3 flex flex-row items-center form-input w-full border-soft_gray border-b-[1.5px] border-slate_blue mb-4">
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                disabled={!medicalField}
                className={`w-full outline-none bg-transparent mx-1 cursor-pointer ${
                  !speciality ? "text-[#9CA3AF]" : "text-text_black"
                }`}
              >
                <option value="">Speciality</option>
                {filteredSpecialities.map((spec) => (
                  <option key={spec} value={spec} className="text-text_black">
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <label className="mb-2" htmlFor="phone">
              Phone Number
            </label>
            <PhoneInput
              country="us"
              enableSearch
              inputStyle={{
                marginLeft: "36px",
              }}
              inputClass="!w-full !px-3 !py-2 !border !rounded-md !focus:outline-none"
              value={phone}
              className="overflow-hidden"
              onChange={(phone) => setValue("phone", phone)}
            />
            {errors.phone && (
              <p className="text-red text-sm mt-1">{errors.phone.message}</p>
            )}
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">My Signature</h2>
              <SignatureCanvas
                sigPadRef={sigPadRef}
                signature={signature}
                setSignature={setSignature}
              />
            </div>
            <div className="flex flex-row items-center justify-start gap-2 mt-4">
              <div className="w-[120px] ">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  label="Save"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
