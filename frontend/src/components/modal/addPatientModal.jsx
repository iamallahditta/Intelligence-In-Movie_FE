import { useRef, useState } from "react";

import Button from "../Button";
import Input from "../Input";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import patientSchema from "../../utils/formSchema/patient";
import toast from "react-hot-toast";
import useAddPatientModal from "../../hooks/modal/useAddPatientModal";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import usePatients from "../../hooks/usePatients";
import { useAddPatientMutation } from "../../hooks/usePatientsQuery";
// import useRecordingData from "../../hooks/useRecordingData";
// import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";

function AddPatientModal() {
  const addPatientModal = useAddPatientModal();
  // const navigate = useNavigate();
  // const { setPatient } = useRecordingData();
  const { setPatients } = usePatients();
  const modalRef = useRef();
  const addPatientMutation = useAddPatientMutation();
  const loading = addPatientMutation.isPending;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      patientId: "",
      gender: "male",
    },
    resolver: zodResolver(patientSchema),
  });

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.handleClose();
      reset();
    }
  };

  const onSubmit = async (data) => {
    try {
      const patientData = await addPatientMutation.mutateAsync(data);
      
      // Update Zustand store for backward compatibility
      setPatients((prev) => [{ ...patientData }, ...prev]);
      
      addPatientModal.onClose();
      reset();
      toast.success("Patient information saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create patient");
      console.error(error);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4 my-2 p-3 relative">
      <div className="absolute top-0 right-0 h-8 w-8 cursor-pointer bg-light_blue rounded-full flex items-center justify-center">
        <IoClose className="w-6 h-6" onClick={handleClose} />
      </div>
      <h1 className="text-2xl font-bold">Add Patient Information</h1>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="firstName"
            register={register}
            placeholder="First Name"
            errors={errors}
            required={true}
          />
          <Input
            id="lastName"
            register={register}
            placeholder="Last Name"
            errors={errors}
            required={true}
          />
        </div>

        <Input
          id="dateOfBirth"
          register={register}
          placeholder="Date of Birth"
          type="date"
          errors={errors}
          required={true}
          max={
            new Date(new Date().setDate(new Date().getDate() - 1))
              .toISOString()
              .split("T")[0]
          }
        />

        <Input
          id="patientId"
          register={register}
          placeholder="Patient Id"
          errors={errors}
          required={true}
        />

        <Input
          id="phoneNumber"
          register={register}
          placeholder="Phone Number"
          type="tel"
          errors={errors}
          required={true}
        />

        <Input
          id="email"
          register={register}
          placeholder="Email Address"
          type="email"
          errors={errors}
          required={true}
        />

        <div className="flex flex-row gap-6 items-center">
          <label className="text-gray font-medium ">Gender:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("gender")}
                value="male"
                className="form-radio accent-navy_blue text-navy_blue"
              />
              <span className="text-gray font-light text-sm">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("gender")}
                value="female"
                className="form-radio accent-navy_blue text-navy_blue"
              />
              <span className="text-gray font-light text-sm">Female</span>
            </label>
          </div>
        </div>
        {errors.gender && (
          <p className="text-rose-500 text-sm">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex flex-row mt-3 items-center justify-end gap-4">
        <div className="w-[150px]">
          <Button onClick={handleClose} outline={true} label={"Cancel"} />
        </div>
        <div className="w-[150px]">
          <Button
            onClick={handleSubmit(onSubmit)}
            label={"Save Info"}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={addPatientModal.isOpen}
      onClose={addPatientModal.onClose}
      body={bodyContent}
      closeClass={`top-2 right-2`}
      ref={modalRef}
    />
  );
}

export default AddPatientModal;
