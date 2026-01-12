import { BiMenuAltLeft, BiPlus } from "react-icons/bi";
import React, { useEffect, useState } from "react";

import AudioPlayer from "./audioPlayer";
import { BsHeartPulseFill } from "react-icons/bs";
import Button from "./Button";
import ConversationHistory from "./conversationHistory";
import { FaBriefcaseMedical } from "react-icons/fa";
import { FaCapsules } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { HiDocumentCheck } from "react-icons/hi2";
import { HiPencil } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi2";
import { MdOutlineDone } from "react-icons/md";
import UpdateNoteModal from "./modal/updateNoteModal";
import moment from "moment";
import toast from "react-hot-toast";
import { truncateString } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import useRecordingData from "../hooks/useRecordingData";
import useRecordings from "../hooks/useRecordings";
import useUpdateNoteModal from "../hooks/modal/useUpdateNoteModal";
import { useTranslation } from "react-i18next";

const PrevRecord = () => {
  const { t } = useTranslation();
  const [selectAll, setSelectAll] = useState(true);

  const { setActiveRecording, activeRecording, setActiveNote, setActiveIndex } =
    useRecordings();
  const navigate = useNavigate();
  const { patient } = useRecordingData();

  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState({});

  useEffect(() => {
    setIsTranscriptOpen(
      typeof window !== "undefined" ? window.innerWidth > 768 : true
    );
  }, [window.innerWidth]);

  useEffect(() => {
    if (activeRecording?.visitNotes) {
      const initialSelectedState = activeRecording.visitNotes.reduce(
        (acc, note) => {
          acc[note.title] = true; // Use title as the key instead of index
          return acc;
        },
        {}
      );
      setSelectedNotes(initialSelectedState);
    }
  }, [activeRecording]);

  useEffect(() => {
    if (Object.keys(selectedNotes).length > 0) {
      const allSelected = Object.values(selectedNotes).every((value) => value);
      setSelectAll(allSelected);
    }
  }, [selectedNotes]);

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);

    if (activeRecording?.visitNotes) {
      const newSelectedState = activeRecording.visitNotes.reduce(
        (acc, note) => {
          acc[note.title] = newValue;
          return acc;
        },
        {}
      );
      setSelectedNotes(newSelectedState);
    }
  };

  const updateNoteModal = useUpdateNoteModal();

  const OptComp = ({ note, Icon, index }) => {
    return (
      <div className="flex flex-col group  ">
        <div className="flex flex-col p-4 w-full h-full bg-light_gray border-[1px] border-soft_gray rounded-xl ">
          <div className="flex flex-row items-center">
            <div
              onClick={() =>
                setSelectedNotes((prev) => ({
                  ...prev,
                  [note.title]: !prev[note.title],
                }))
              }
              className="flex items-center justify-center cursor-pointer bg-gray2 h-5 w-5 rounded-md"
            >
              <MdOutlineDone
                className={`text-navy_blue font-bold text-xl ${
                  selectedNotes[note.title] ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="mx-2">
              <Icon />
            </div>
            <h1 className="text-xl font-medium tracking-wide">
              {note?.title && note.title !== "false" ? note.title : ""}
            </h1>
            <div
              onClick={() => {
                setActiveNote(note);

                updateNoteModal.onOpen();
              }}
              className="cursor-pointer w-6 h-6 ml-auto rounded-full flex items-center justify-center bg-light_blue"
            >
              <HiPencil className="text-navy_blue text-lg" />
            </div>
          </div>
          <h1 className="mt-3 font-light text-gray mx-2">
            {note?.description && note.description !== "false"
              ? note.description
              : ""}
          </h1>
          {note?.others &&
            note.others.map((item, index) => (
              <div key={index} className="flex flex-col mt-3 px-2">
                <h1 className="font-semibold text-navy_blue inline-block">
                  {item?.title && item.title !== "false" ? item.title : ""}
                </h1>
                <p className="ml-2 font-light text-gray mx-2">
                  {item?.description && item.description !== "false"
                    ? item.description
                    : ""}
                </p>
              </div>
            ))}
        </div>
        <div className=" flex-row h-10 justify-end flex mt-auto">
          <div
            onClick={() => {
              setActiveNote(null);
              setActiveIndex(index + 1);
              updateNoteModal.onOpen();
            }}
            className="flex flex-row group-hover:opacity-100 opacity-0 duration-200  items-center mx-auto my-auto justify-center cursor-pointer bg-gray2 h-5 w-5 rounded-md"
          >
            <BiPlus className="text-navy_blue text-lg" />
          </div>
        </div>
      </div>
    );
  };

  const handleExportToPDF = () => {
    const filteredRecording = {
      ...activeRecording,
      visitNotes: activeRecording.visitNotes.filter(
        (note) => selectedNotes[note.title]
      ),
    };

    if (patient) {
      filteredRecording.patient = patient;
    }

    navigate("/editor", { state: { activeRecording: filteredRecording } });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full relative">
      {/* Backdrop for mobile transcript */}
      {isTranscriptOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsTranscriptOpen(false)}
        />
      )}
      
      <div className="w-full flex flex-col h-full overflow-y-scroll no-scrollbar">
        <div className=" flex-grow  p-4">
          <div className="flex flex-row">
            <div className="flex flex-col flex-grow">
              <h1 className="text-2xl font-bold tracking-wide">
                {t("medical_notes")}
              </h1>
              <h1 className="font-light font-sm tracking-wide">
                {t("structured_insights")}
              </h1>
            </div>
            <BiMenuAltLeft
              onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
              className={`${
                !isTranscriptOpen ? "block" : "hidden"
              } ml-auto text-2xl cursor-pointer`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-0 mt-7">
            {activeRecording?.visitNotes.map((item, index) => (
              <OptComp
                key={item.title}
                note={item}
                index={index}
                Icon={() => (
                  <BsHeartPulseFill className="text-navy_blue text-xl" />
                )}
              />
            ))}
          </div>

          <div className="w-full p-4 bg-light_gray flex flex-col mt-6 rounded-xl">
            <h1 className="text-xl font-medium tracking-wide">
              Patient Information
            </h1>

            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Name
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.firstName} {patient?.lastName}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Medical ID
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.id}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Date of Birth
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.dateOfBirth
                    ? moment(patient.dateOfBirth).format("MMM DD, YYYY")
                    : ""}
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Phone Number
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.phoneNumber}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Email
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.email}
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center w-full gap-1 sm:gap-0">
                <h1 className="w-full sm:w-[30%] md:w-[25%] xl:w-[20%] font-medium">
                  Gender
                </h1>
                <h1 className="flex-grow text-text_black font-light">
                  {patient?.gender}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-light_gray p-4">
          <Button
            label="Select Section"
            outline={true}
            onClick={handleSelectAll}
            IconLeft={() => (
              <div className="flex items-center justify-center cursor-pointer bg-gray2 h-5 w-5 rounded-md">
                <MdOutlineDone
                  className={`text-navy_blue font-bold text-xl ${
                    selectAll ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )}
          />
          <Button
            onClick={() => setActiveRecording(null)}
            label="Mark as Complete"
            outline={true}
          />
          <Button
            label="Copy to Clipboard"
            outline={true}
            onClick={() => {
              // Create formatted text from selected notes
              const selectedNotesSections = activeRecording?.visitNotes
                .filter((note) => selectedNotes[note.title])
                .map((note) => {
                  let noteText = `${note.title}:\n${note.description || ""}`;

                  // Add any additional items from others array
                  if (note.others && note.others.length > 0) {
                    noteText +=
                      "\n" +
                      note.others
                        .map(
                          (item) =>
                            `${item.title}: ${item.description || "N/A"}`
                        )
                        .join("\n");
                  }

                  return noteText;
                });

              // Add patient information
              const patientInfo = `Patient Information:
                       Name: ${patient?.firstName} ${patient?.lastName}
                 Date of Birth: ${
                   patient?.dateOfBirth
                     ? moment(patient.dateOfBirth).format("YYYY - MM - DD")
                     : ""
                 }
                         Medical ID: ${patient?.id}
                        Phone Number: ${patient?.phoneNumber}
                      Email: ${patient?.email}
                       Gender: ${patient?.gender}
`;

              const formattedText = `${patientInfo}\n${selectedNotesSections.join(
                "\n\n"
              )}`;

              navigator.clipboard
                .writeText(formattedText)
                .then(() => {
                  toast.success("Medical notes copied to clipboard!");
                })
                .catch((err) => {
                  toast.error("Failed to copy to clipboard");
                });
            }}
          />
          <Button onClick={handleExportToPDF} label="Export as PDF" />
        </div>
      </div>

      <div
        className={` ${
          isTranscriptOpen
            ? "w-full lg:w-80 opacity-100 px-4"
            : "w-0 opacity-0 px-0"
        } duration-200 border-l-[1px] border-soft_gray bg-light_gray py-4 flex flex-col items-center shrink-0 overflow-y-scroll no-scrollbar fixed lg:relative right-0 top-0 h-full z-40`}
      >
        <div className={`${isTranscriptOpen ? "block" : "hidden"} w-full mb-2`}>
          <BiMenuAltLeft
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="cursor-pointer text-2xl  "
          />
        </div>
        {activeRecording?.audio?.duration !== "00:00" && (
          <AudioPlayer
           key={activeRecording?.audio?.url}
            audio={activeRecording?.audio}
            audioUrl={activeRecording?.audio.url}
          />
        )}

        <ConversationHistory />
        <div className="w-full bg-white rounded-xl flex flex-col p-2 mt-3">
          <h1 className="text-xl">{t("conversation_summary")}</h1>
          <p className="text-sm font-light mt-2 ">
            {activeRecording?.summary?.content}
          </p>
        </div>
      </div>
      <UpdateNoteModal />
    </div>
  );
};

export default PrevRecord;
