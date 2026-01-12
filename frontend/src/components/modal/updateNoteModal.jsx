import { HiOutlineTrash } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";

import Button from "../Button";
import Input from "../Input";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import TextArea from "../TextArea";
import axios from "axios";
// import patientSchema from "../../utils/formSchema/patient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import useUpdateNoteModal from "../../hooks/modal/useUpdateNoteModal";
// import { v4 as uuidv4 } from 'uuid';
// import { zodResolver } from "@hookform/resolvers/zod";

function UpdateNoteModal() {
  const updateNoteModal = useUpdateNoteModal();
  // const navigate = useNavigate();
  // const { setPatient } = useRecordingData();
  const {
    activeNote,
    resetActiveNote,
    activeIndex,
    activeRecording,
    setActiveRecording,
    recordings,
    setRecordings,
  } = useRecordings();
  const modalRef = useRef();
  const [others, setOthers] = useState([]);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (activeNote) {
      const formValues = {
        title: activeNote.title || "",
        description: activeNote.description || "",
      };

      if (activeNote.others?.length > 0) {
        activeNote.others.forEach((other, index) => {
          formValues[`others.${index}.title`] = other.title;
          formValues[`others.${index}.description`] = other.description;
        });
        setOthers(activeNote.others);
      } else {
        setOthers([]);
      }

      reset(formValues);
    } else {
      reset({
        title: "",
        description: "",
      });
      setOthers([]);
    }
  }, [activeNote, reset]);

  const addOtherField = () => {
    setOthers([...others, { title: "", description: "" }]);
  };

  const removeOtherField = (index) => {
    const newOthers = others.filter((_, idx) => idx !== index);
    setOthers(newOthers);

    const currentValues = {};
    Object.keys(register).forEach((key) => {
      if (!key.startsWith(`others.${index}`)) {
        currentValues[key] = register[key].value;
      }
    });

    for (let i = index + 1; i < others.length; i++) {
      if (currentValues[`others.${i}.title`]) {
        currentValues[`others.${i - 1}.title`] =
          currentValues[`others.${i}.title`];
        currentValues[`others.${i - 1}.description`] =
          currentValues[`others.${i}.description`];
        delete currentValues[`others.${i}.title`];
        delete currentValues[`others.${i}.description`];
      }
    }

    reset(currentValues);
  };

  const handleClose = () => {
    resetActiveNote();
    reset();
    if (modalRef.current) {
      modalRef.current.handleClose();
    }
  };

  const onSubmit = async (data) => {
    if (!data.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    setUpdating(true);

    const noteData = {
      ...data,
    };

    let updatedNotes;
    if (activeNote) {
      updatedNotes = activeRecording.visitNotes.map((note) =>
        note.title === activeNote.title ? noteData : note
      );
    } else {
      const titleExists = activeRecording.visitNotes.some(
        (note) => note.title.toLowerCase() === data.title.toLowerCase()
      );

      if (titleExists) {
        toast.error("A note with this title already exists!");
        setUpdating(false);
        return;
      }

      updatedNotes = [
        ...activeRecording.visitNotes.slice(0, activeIndex),
        noteData,
        ...activeRecording.visitNotes.slice(activeIndex),
      ];
    }

    const updatedRecording = {
      ...activeRecording,
      visitNotes: updatedNotes,
    };

    try {
      let updatedRecord = await axios.put(
        `/v1/api/record/${activeRecording.id}`,
        {
          visitNotes: updatedNotes,
        }
      );

      updatedRecord = updatedRecord.data.data;

      setActiveRecording(updatedRecording);

      const currentRecordings = Array.isArray(recordings) ? recordings : [];
      const updatedRecordings = currentRecordings.map((recording) =>
        recording.id === activeRecording.id ? updatedRecording : recording
      );
      setRecordings(updatedRecordings);

      updateNoteModal.onClose();
      resetActiveNote();
      reset();
      toast.success(
        activeNote ? "Note updated successfully!" : "Note added successfully!"
      );
      setUpdating(false);
    } catch (error) {
      console.error("Error updating recording:", error);
      toast.error("Failed to update recording. Please try again.");
      setUpdating(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4 my-2 p-3 relative max-h-[90vh] overflow-y-auto">
      <div className="absolute top-0 right-0 h-8 w-8 cursor-pointer bg-light_blue rounded-full flex items-center justify-center">
        <IoClose className="w-6 h-6" onClick={handleClose} />
      </div>
      <h1 className="text-2xl font-bold">Note Information</h1>

      <div>
        <Input
          id="title"
          register={register}
          placeholder="Enter Title"
          errors={errors}
          required={true}
        />

        <TextArea
          id="description"
          register={register}
          placeholder="Enter Description"
          errors={errors}
          required={false}
        />
      </div>

      {/* Dynamic Others Fields */}
      {others.map((other, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 p-3 border border-gray-200 rounded-md"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium">Additional Note {index + 1}</h2>
            <button
              type="button"
              onClick={() => removeOtherField(index)}
              className="text-red-500 hover:text-red-700"
            >
              <HiOutlineTrash className="text-lg text-rose-600" />
            </button>
          </div>

          <Input
            id={`others.${index}.title`}
            register={register}
            placeholder="Enter Title"
            errors={errors}
            required={true}
          />

          <TextArea
            id={`others.${index}.description`}
            register={register}
            placeholder="Enter Description"
            errors={errors}
            required={false}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addOtherField}
        className="w-full py-2 px-4 border border-navy_blue text-navy_blue rounded-md hover:bg-light_blue transition-colors"
      >
        + Additonal Note
      </button>

      <div className="flex flex-row mt-3 items-center justify-end gap-4">
        <div className="w-[150px]">
          <Button onClick={handleClose} outline={true} label={"Cancel"} />
        </div>
        <div className="w-[150px]">
          <Button
            onClick={handleSubmit(onSubmit)}
            label={"Save Info"}
            disabled={updating}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={updateNoteModal.isOpen}
      onClose={updateNoteModal.onClose}
      body={bodyContent}
      closeClass={`top-2 right-2`}
      ref={modalRef}
    />
  );
}

export default UpdateNoteModal;
