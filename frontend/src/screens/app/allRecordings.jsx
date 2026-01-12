import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { AiFillPlusSquare } from "react-icons/ai";
import Button from "../../components/Button";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import EditPatientModal from "../../components/modal/editPatientModal";
import { FaEdit } from "react-icons/fa";
import FullScreenRecording from "../../components/fullScreenRecording";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoCalendar, IoCallOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { LiaStethoscopeSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import PrevRecord from "../../components/prevRecord";
// import { S3Deleter } from "../../utils/deleteFromS3";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import useAddPatientModal from "../../hooks/modal/useAddPatientModal";
import useEditPatientModal from "../../hooks/modal/useEditPatientModal";
import useFullScreenRecording from "../../hooks/useFullScreenRecording";
import usePatients from "../../hooks/usePatients";
import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import useUser from "../../hooks/auth/useUser";
import { usePatientQuery } from "../../hooks/usePatientsQuery";
import { BsPerson } from "react-icons/bs";

const RecordingComp = ({ recording, patientFromQuery }) => {
  const {
    recordings,
    setRecordings,
    setActiveRecording,
    isRecordLoading,
    setIsRecordLoading,
  } = useRecordings();
  const addPatientModal = useAddPatientModal();
  const { patients, setPatients } = usePatients();
  const { patient } = useRecordingData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { setShowFullScreenRecording } = useFullScreenRecording();

  const handleDeleteClick = (e) => {
    setShowDeleteModal(true);
    e.stopPropagation();
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const deletePromises = [];

      // Delete audio file from backend
      if (recording?.audio?.url) {
        const urlParts = recording.audio.url.split("/");
        const fileNameWithExtension = urlParts[urlParts.length - 1];

        deletePromises.push(
          axios
            .delete(`/v1/api/audio/${fileNameWithExtension}`)
            .catch((err) => {
              console.error("Error deleting audio file:", err);
            })
        );
      }
      // Delete transcript JSON from backend
      if (recording?.transcriptJsonId) {
        deletePromises.push(
          axios
            .delete(`/v1/api/delete-json/${recording.transcriptJsonId}`)
            .catch((err) => {
              console.error("Error deleting transcript file:", err);
            })
        );
      }

      // Wait for both deletions in parallel
      await Promise.all(deletePromises);

      // Notify backend to delete the recording metadata (DB entry)
      await axios.delete(`/v1/api/record/${recording.id}`);

      // Update local state - ensure recordings is an array
      const currentRecordings = Array.isArray(recordings) ? recordings : [];
      const updatedRecordings = currentRecordings.filter(
        (rec) => rec.id !== recording.id
      );
      setActiveRecording(null);
      setRecordings(updatedRecordings);

      const updatedPatients = patients.map((p) => {
        if (p.id === patient.id) {
          return {
            ...p,
            recordings:
              updatedRecordings.length > 0 ? [updatedRecordings[0]] : [],
          };
        }
        return p;
      });

      setPatients(updatedPatients);

      toast.success("Recording deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting recording:", error);
      toast.error("Failed to delete recording");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <tr
        onClick={(e) => {
          setActiveRecording(recording);
          const currentPatient = patient || patientFromQuery;
          if (currentPatient?.id) {
            navigate(`/patient_recordings?patientId=${currentPatient.id}`);
          } else {
            navigate("/patient_recordings");
          }
        }}
        className="cursor-pointer group hover:shadow-sm transition-shadow"
      >
        <td className="bg-[#FAFAFA] p-4 text-sm text-gray-900 font-light first:rounded-l-xl last:rounded-r-xl group-hover:bg-[#ededed] transition-colors">
          {moment(recording?.createdAt).format("DD MMM, YYYY")}
        </td>
        <td className="bg-[#FAFAFA] p-4 text-sm text-gray-900 font-light group-hover:bg-[#ededed] transition-colors">
          Dr. {user?.username}
        </td>
        <td className="bg-[#FAFAFA] p-4 text-sm text-gray-900 font-light flex items-center gap-2 group-hover:bg-[#ededed] transition-colors">
          {recording?.audio?.duration ? recording?.audio?.duration : "N/A"}
        </td>
        <td className="bg-[#FAFAFA] first:rounded-l-xl last:rounded-r-xl p-4 group-hover:bg-[#ededed] transition-colors">
          <MdDelete
            onClick={handleDeleteClick}
            className="text-navy_blue cursor-pointer text-xl"
          />
        </td>
      </tr>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        message="Are You Sure? This can't be undone."
      />
    </>
  );
};

const AllRecordings = () => {
  const { patient, setPatient } = useRecordingData();
  const editPatientModal = useEditPatientModal();
  const location = useLocation();

  const {
    recordings,
    setRecordings,
    setActiveRecording,
    setIsRecordLoading,
    isRecordLoading,
  } = useRecordings();
  const addPatientModal = useAddPatientModal();
  const { patients } = usePatients();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get patient ID from URL params
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get('patientId');

  // Fetch patient from React Query if ID is in URL but not in store
  const { data: patientFromQuery, isLoading: isLoadingPatient } = usePatientQuery(
    patientIdFromUrl && !patient ? patientIdFromUrl : null
  );

  // Set patient from React Query if available and not in store
  useEffect(() => {
    if (patientFromQuery && !patient) {
      setPatient(patientFromQuery);
    }
  }, [patientFromQuery, patient, setPatient]);

  const fetchRecordings = useCallback(
    async (page = 1, append = false) => {
      try {
        if (!patient?.id) {
          console.log("No patient ID available");
          return;
        }

        // Set loading state
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsRecordLoading(true);
        }

        const { data } = await axios.get(
          `/v1/api/record/patient/${patient.id}?page=${page}&limit=10`
        );

        // Ensure newRecords is always an array
        const newRecords = Array.isArray(data?.data?.records) 
          ? data.data.records 
          : [];
        const pagination = data?.data?.pagination || {};

        // Update recordings - append if loading more, replace if initial load
        if (append) {
          // Use functional update to append new records to existing ones
          setRecordings((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            // Filter out duplicates by ID to prevent duplicate records
            const existingIds = new Set(prevArray.map(rec => rec.id));
            const uniqueNewRecords = newRecords.filter(rec => !existingIds.has(rec.id));
            return [...prevArray, ...uniqueNewRecords];
          });
        } else {
          // Replace recordings on initial load
          setRecordings(newRecords);
        }

        // Update pagination state
        setCurrentPage(pagination.page || page);
        // Only set hasMore to true if there are more pages AND we have data
        const hasMorePages = (pagination.page || page) < (pagination.pages || 1);
        setHasMore(hasMorePages && newRecords.length > 0);

        setIsRecordLoading(false);
        setIsLoadingMore(false);
      } catch (error) {
        console.log("Error fetching recordings:", error);
        toast.error("Something went wrong!");
        if (!append) {
          setRecordings([]); // Set empty array on error only for initial load
        }
        setIsRecordLoading(false);
        setIsLoadingMore(false);
      }
    },
    [patient?.id, setRecordings, setIsRecordLoading]
  );

  // Load more recordings
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchRecordings(currentPage + 1, true);
    }
  };

  // Reset and fetch when patient changes
  useEffect(() => {
    if (patient?.id) {
      setCurrentPage(1);
      setHasMore(false);
      fetchRecordings(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id]);

  // Show loading if patient is being fetched
  if (isLoadingPatient && !patient) {
    return (
      <div className="flex flex-col w-full h-full p-6 items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading patient information...</div>
      </div>
    );
  }

  // Show message if no patient is available
  if (!patient && !isLoadingPatient) {
    return (
      <div className="flex flex-col w-full h-full p-6 items-center justify-center">
        <h2 className="text-xl font-medium text-gray-600 mb-4">No patient selected</h2>
        <Button
          onClick={() => navigate("/")}
          label="Go to Patients"
          outline={true}
        />
      </div>
    );
  }

  return (
    <div className=" flex flex-col w-full h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium flex items-center gap-2">
          Patient Information
        </h1>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg p-6 mb-6 flex items-center gap-6 relative">
        <div
          onClick={() => editPatientModal.onOpen()}
          className="w-4 h-4 cursor-pointer absolute top-3 right-3"
        >
          <FaEdit className="text-navy_blue text-xl" />
        </div>
        {/* <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src={
              patient?.profileImage ||
              "data:image/jpeg;base64,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"
            }
            alt="Patient"
            className="w-full h-full object-cover"
          />
        </div> */}

        <div className="flex flex-col gap-2 ">
          <h2 className="text-xl font-semibold ">
            {patient?.firstName} {patient?.lastName}
          </h2>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <IoMdPerson className="text-lg text-navy_blue" />
              <span className="text-gray font-light">
                <i className="fas fa-user"></i> Age:{" "}
                {patient?.dateOfBirth
                  ? (() => {
                      const years = moment().diff(moment(patient.dateOfBirth), "years");
                      if (years >= 1) {
                        return `${years} Years Old`;
                      }
                      const months = moment().diff(moment(patient.dateOfBirth), "months");
                      if (months >= 1) {
                        return `${months} Months Old`;
                      }
                      const days = moment().diff(moment(patient.dateOfBirth), "days");
                      return `${days} Days Old`;
                    })()
                  : "-"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <PiIdentificationBadgeFill className="text-lg text-navy_blue" />
              <span className="text-gray font-light">
                <i className="fas fa-id-card"></i> Scribe ID:{" "}
                {patient?.medicalId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <PiIdentificationBadgeFill className="text-lg text-navy_blue" />
              <span className="text-gray font-light">
                <i className="fas fa-id-card"></i> Patient ID:{" "}
                {patient?.patientId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IoCallOutline className="text-lg text-navy_blue" />
              <span className="text-gray font-light">
                <i className="fas fa-id-card"></i> Phone Number:{" "}
                {patient?.phoneNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <BsPerson className="text-lg text-navy_blue" />
              <span className="text-gray font-light">
                <i className="fas fa-id-card"></i> Gender: {patient?.gender}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IoMdMail className="text-lg text-navy_blue" />

              <span className="text-gray font-light">
                <i className="fas fa-envelope"></i> Contact: {patient?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium flex items-center gap-2">
          History
        </h1>
      </div>

      {/* Patients Table */}
      {isRecordLoading ? (
        <div className="overflow-x-scroll lg:overflow-x-auto my-2 w-[calc(100vw-3rem)] lg:w-[calc(100vw-19rem)]">
          <table className="w-full min-w-[800px] whitespace-nowrap border-separate border-spacing-y-2">
            {/* <thead className="bg-gray-50 sticky top-0">
              <tr className="bg-white">
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Visit Date
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Examiner
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Session Duration
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  {" "}
                </th>
              </tr>
            </thead> */}
            <tbody className="divide-y divide-light_gray">
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="bg-light_gray p-4">
                    <div className="h-4 bg-light_gray rounded w-24"></div>
                  </td>
                  <td className="bg-light_gray p-4">
                    <div className="h-4 bg-light_gray rounded w-32"></div>
                  </td>
                  <td className="bg-light_gray p-4">
                    <div className="h-4 bg-light_gray rounded w-20"></div>
                  </td>
                  <td className="bg-light_gray p-4">
                    <div className="h-4 bg-light_gray rounded w-4"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : recordings?.length > 0 ? (
        <div className="my-2">
          <table className="w-full min-w-[800px] whitespace-nowrap border-separate border-spacing-y-2">
            <thead className="bg-gray-50 sticky top-0 ">
              <tr className="bg-white">
                {/* <th className="p-4 text-left w-12 border-b-[0.5px] border-[#030229]">
                  <input
                    type="checkbox"
                    className="rounded accent-navy_blue cursor-pointer"
                  />
                </th> */}
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Visit Date
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Examiner
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Session Duration
                </th>
                {/* <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Prescription
                </th> */}
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(recordings) && recordings.map((recording, index) => (
                <RecordingComp key={index} recording={recording} patientFromQuery={patientFromQuery} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <h3 className="text-2xl font-medium text-gray mb-2">
            No Recordings Found
          </h3>
          <p className="text-gray text-center mb-6 max-w-md">
            Each recording will be stored with the visit date and session
            duration for easy reference.
          </p>
          <div className="w-[250px] mx-auto">
            <Button
              onClick={() => navigate("/recording")}
              outline={true}
              label="Start Recording"
              IconLeft={() => (
                <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
              )}
            />
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center my-6 pb-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            outline={true}
            label={isLoadingMore ? "Loading..." : "Load More Recordings"}
            IconLeft={() =>
              isLoadingMore ? (
                <div className="w-5 h-5 border-2 border-navy_blue border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
              )
            }
          />
        </div>
      )}

      <EditPatientModal />
    </div>
  );
};

export default AllRecordings;
