import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { HiMagnifyingGlass, HiPlus, HiUserPlus } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import useSelectPatientModal from "../../hooks/modal/useSelectPatientModal";
import { usePatientsQuery } from "../../hooks/usePatientsQuery";
import { useTemplateNamesQuery } from "../../hooks/useTemplatesQuery";
import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import Button from "../Button";
import Modal from "./modal";
import useAddPatientModal from "../../hooks/modal/useAddPatientModal";

function SelectPatientModal() {
  const selectPatientModal = useSelectPatientModal();
  const addPatientModal = useAddPatientModal();

  const { setPatient } = useRecordingData();
  const navigate = useNavigate();
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    templateId,
    setTemplateId,
    setTemplateName,
  } = useRecordings();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use React Query for patients and templates with search
  const { data: filteredPatients = [] } = usePatientsQuery(debouncedSearch);
  const { data: templates = [], isLoading: templateLoading } = useTemplateNamesQuery();


  const handleClose = () => {
    setSearchTerm("");
    modalRef.current?.handleClose();
  };

  const handleAddPatient = () => {
    setSearchTerm("");
    selectPatientModal.onClose();
    addPatientModal.onOpen();
  };

  // Patient Selection
  const handleSelectPatient = (patient) => {
    if (!templateId) {
      toast.error("Please Select Template");
      return;
    }
    setPatient(patient);
    setSearchTerm("");
    selectPatientModal.onClose();
    navigate("/recording");
  };

  const bodyContent = (
    <div className="flex flex-col gap-4 my-2 p-3 relative max-h-[80vh]">
      <div className="absolute top-0 right-0 h-8 w-8 cursor-pointer bg-light_blue rounded-full flex items-center justify-center">
        <IoClose className="w-6 h-6" onClick={handleClose} />
      </div>

      <h1 className="text-2xl font-bold">Select Template & Patient</h1>

      {/* Template Dropdown */}
      {templateLoading ? (
        <div className="p-4 flex items-center justify-center">
          <Oval height="24" width="24" color="#002366" secondaryColor="#fff" />
        </div>
      ) : (
        <div>
          <label className="block mb-2 font-medium text-navy_blue">
            Select Template
          </label>
          <div className="relative w-full">
            <select
              value={templateId}
              onChange={(e) => {
                const selectedTemplate = templates.find(
                  (t) => t.id === e.target.value
                );
                setTemplateId(e.target.value);
                setTemplateName(selectedTemplate?.templateName || "");
              }}
              className="w-full py-2 pl-[0.65rem] pr-8 border border-navy_blue rounded-lg outline-none text-navy_blue appearance-none"
            >
              <option value="">Select a template</option>
              {templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.templateName || "Untitled Template"}
                  {!template.userId ? " (Default)" : ""}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-navy_blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4 flex items-center w-full p-3 border border-navy_blue rounded-lg">
        <HiMagnifyingGlass className="text-2xl text-navy_blue" />
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name or ID"
          className="w-full pl-3 outline-none text-navy_blue"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-navy_blue">Select Patient</h3>
        <button
          onClick={handleAddPatient}
          className="flex items-center gap-1 text-navy_blue hover:text-opacity-80 transition-colors text-sm font-medium"
        >
          <HiPlus className="text-lg" />
          Add New
        </button>
      </div>

      {/* Patient List */}
      <div className="overflow-y-auto flex-grow">
        {filteredPatients.length > 0 ? (
          <div className="grid gap-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-light_blue cursor-pointer transition-colors"
              >
                <div>
                  <h3 className="font-medium text-navy_blue">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm font-light text-gray">
                    {patient.medicalId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <HiUserPlus className="text-4xl text-gray-400 mx-auto mb-0.5" />
            <p className="text-gray-500">No patients found</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <div className="w-[120px]">
          <Button onClick={handleClose} outline label="Cancel" />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={selectPatientModal.isOpen}
      onClose={selectPatientModal.onClose}
      body={bodyContent}
      closeClass="top-2 right-2"
      ref={modalRef}
    />
  );
}

export default SelectPatientModal;
