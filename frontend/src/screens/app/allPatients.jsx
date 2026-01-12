import React, { useState, useMemo, useEffect } from "react";

import { AiFillPlusSquare } from "react-icons/ai";
import Button from "../../components/Button";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoCalendar } from "react-icons/io5";
import { LiaStethoscopeSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import useAddPatientModal from "../../hooks/modal/useAddPatientModal";
import { useNavigate } from "react-router-dom";
import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import { usePatientsInfiniteQuery, useDeletePatientMutation } from "../../hooks/usePatientsQuery";
import { RxExternalLink } from "react-icons/rx";

const AllPatients = () => {
  const addPatientModal = useAddPatientModal();
  const { setIsRecordLoading } = useRecordings();
  const { setPatient } = useRecordingData();
  const [searchTerms, setSearchTerms] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();
  const [selectedPatients, setSelectedPatients] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerms);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerms]);

  // Use React Query Infinite Query for pagination with search
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingData,
  } = usePatientsInfiniteQuery(debouncedSearch);

  const deletePatientMutation = useDeletePatientMutation();

  // Flatten all pages into single array
  const patientsList = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.patients);
  }, [data]);

  // Load more patients using React Query
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const selectedPatientsArray = patientsList.filter(
        (patient) => selectedPatients[patient.medicalId]
      );

      for (const patient of selectedPatientsArray) {
        // Fetch all recordings for this patient
        try {
          const { data } = await axios.get(
            `/v1/api/record/patient/${patient.id}`
          );

          const recordings = data?.data?.records;

          // Delete each recording
          for (const recording of recordings) {
            // const s3Deleter = new S3Deleter();

            // Delete audio file
            try {
              // await s3Deleter.deleteFile(`recordings/${recording.audio.id}.mp3`);
            } catch (error) {
              console.error("Error deleting audio file:", error);
            }

            // Delete transcript file
            try {
              // await s3Deleter.deleteFile(
              //   `transcripts/${recording.transcriptJson.id}.json`
              // );
            } catch (error) {
              console.error("Error deleting transcript file:", error);
            }

            // Notify backend
            try {
              await axios.delete(`/v1/api/record/${recording.id}`);
            } catch (error) {
              console.error("Error deleting recording:", error);
            }
          }

          // Delete the patient using React Query mutation
          await deletePatientMutation.mutateAsync(patient.id);
        } catch (error) {
          console.error(`Error processing patient ${patient.id}:`, error);
          toast.error(
            `Failed to delete patient ${patient.firstName} ${patient.lastName}`
          );
        }
      }

      // React Query will automatically refetch after mutation
      setSelectedPatients({});

      toast.success(
        "Selected patients and their recordings deleted successfully"
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error in deletion process:", error);
      toast.error("An error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedPatients = {};

    patientsList
      // eslint-disable-next-line array-callback-return
      .filter((p) => {
        if (
          p?.firstName?.toLowerCase().includes(searchTerms.toLowerCase()) ||
          p?.lastName?.toLowerCase().includes(searchTerms.toLowerCase()) ||
          p?.medicalId?.toLowerCase().includes(searchTerms.toLowerCase())
        ) {
          return p;
        }
      })
      .forEach((patient) => {
        newSelectedPatients[patient.medicalId] = isChecked;
      });

    setSelectedPatients(newSelectedPatients);
  };

  const handleSelectOne = (patientId) => {
    setSelectedPatients((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  const areAllSelected = () => {
    // eslint-disable-next-line array-callback-return
    const filteredPatients = patientsList.filter((p) => {
      if (
        p?.firstName?.toLowerCase().includes(searchTerms.toLowerCase()) ||
        p?.lastName?.toLowerCase().includes(searchTerms.toLowerCase()) ||
        p?.medicalId?.toLowerCase().includes(searchTerms.toLowerCase())
      ) {
        return p;
      }
    });

    return (
      filteredPatients.length > 0 &&
      filteredPatients.every((p) => selectedPatients[p.medicalId])
    );
  };

  const handleClick = () => {
    setSearchTerms("");
    addPatientModal.onOpen();
  };

  const filteredPatients = patientsList;

  return (
    <div className=" flex flex-col w-full h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium flex items-center gap-2">
          <LiaStethoscopeSolid className="text-3xl text-navy_blue" />
          All Patients
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 flex items-center w-full p-3  border border-navy_blue rounded-lg">
        <HiMagnifyingGlass className="text-2xl text-navy_blue" />

        <input
          type="text"
          value={searchTerms}
          placeholder="Search Patients"
          className="w-full pl-3 outline-none text-navy_blue"
          onChange={(e) => setSearchTerms(e.target.value)}
        />
      </div>

      {/* Add Patient Button */}
      <div
        className={`w-[200px] ml-auto ${
          patientsList.length > 0 ? "flex" : "hidden"
        }`}
      >
        <Button
          onClick={handleClick}
          outline={true}
          label={"Add New Patient"}
          IconLeft={() => (
            <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
          )}
        />
      </div>

      {/* Patients Table */}
      {isLoadingData ? (
        <div className="my-2">
          {/* Mobile Loading Cards */}
          <div className="block lg:hidden space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-[#D1D5DB] rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-[#D1D5DB] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#D1D5DB] rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-[#D1D5DB] rounded w-2/3"></div>
              </div>
            ))}
          </div>
          {/* Desktop Loading Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px] whitespace-nowrap border-separate border-spacing-y-2">
              <tbody className="divide-y divide-light_gray">
                {[1, 2, 3].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="bg-[#D1D5DB] p-4 first:rounded-l-xl last:rounded-r-xl">
                      <div className="h-4 bg-[#D1D5DB] rounded w-24"></div>
                    </td>
                    <td className="bg-[#D1D5DB] p-4">
                      <div className="h-4 bg-[#D1D5DB] rounded w-32"></div>
                    </td>
                    <td className="bg-[#D1D5DB] p-4">
                      <div className="h-4 bg-[#D1D5DB] rounded w-20"></div>
                    </td>
                    <td className="bg-[#D1D5DB] p-4 first:rounded-l-xl last:rounded-r-xl">
                      <div className="h-4 bg-[#D1D5DB] rounded w-4"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredPatients?.length > 0 ? (
        <div className="my-2">
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-3">
            {filteredPatients?.map((patient, index) => (
              <div
                key={index}
                className="bg-[#FAFAFA] rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="rounded accent-navy_blue cursor-pointer mt-1"
                      checked={selectedPatients[patient.medicalId] || false}
                      onChange={() => handleSelectOne(patient.medicalId)}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {patient?.firstName} {patient?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {patient?.medicalId}</p>
                    </div>
                  </div>
                  <MdDelete
                    onClick={(e) => {
                      setIsRecordLoading(true);
                      e.stopPropagation();
                      const hasSelectedPatients = Object.values(
                        selectedPatients
                      ).some((value) => value);
                      if (hasSelectedPatients) {
                        setShowDeleteModal(true);
                      } else {
                        toast.error(
                          "Please select at least one patient to delete"
                        );
                      }
                    }}
                    className="text-navy_blue cursor-pointer text-xl"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Patient ID:</span>
                    <span className="text-gray-900">{patient?.patientId || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoCalendar className="text-navy_blue" />
                    <span className="text-gray-900">
                      {patient?.recordings?.length > 0
                        ? moment(patient.recordings?.[0]?.createdAt).format(
                            "DD MMM, YYYY"
                          )
                        : "NA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">
                      {patient?.recordings?.length > 0
                        ? patient.recordings?.[0]?.audio?.duration
                        : "NA"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatient(patient);
                    navigate(`/recordings?patientId=${patient.id}`);
                  }}
                  className="mt-3 w-full text-center py-2 text-navy_blue hover:text-hover_effect font-medium border border-navy_blue rounded-lg hover:bg-light_blue transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px] whitespace-nowrap border-separate border-spacing-y-2">
            <thead className="bg-gray-50 sticky top-0 ">
              <tr className="bg-white">
                <th className="p-4 text-left w-12 border-b-[0.5px] border-[#030229]">
                  <input
                    type="checkbox"
                    className="rounded accent-navy_blue cursor-pointer"
                    checked={areAllSelected()}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Scribe Id
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Patient Id
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Patient Name
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Last Visit
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  Session Duration
                </th>
                <th className="p-4 text-left text-sm font-medium text-navy_blue border-b-[0.5px] border-[#030229]">
                  <MdDelete
                    onClick={(e) => {
                      setIsRecordLoading(true);
                      e.stopPropagation();
                      const hasSelectedPatients = Object.values(
                        selectedPatients
                      ).some((value) => value);
                      if (hasSelectedPatients) {
                        setShowDeleteModal(true);
                      } else {
                        toast.error(
                          "Please select at least one patient to delete"
                        );
                      }
                    }}
                    className="text-navy_blue cursor-pointer text-xl"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="">
              {filteredPatients?.map((patient, index) => (
                <tr
                  key={index}
                  className="group hover:shadow-sm transition-shadow"
                >
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] first:rounded-l-xl last:rounded-r-xl p-4 transition-colors">
                    <input
                      type="checkbox"
                      className="rounded accent-navy_blue cursor-pointer"
                      checked={selectedPatients[patient.medicalId] || false}
                      onChange={() => handleSelectOne(patient.medicalId)}
                    />
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] p-4 text-sm text-gray-900 font-light first:rounded-l-xl last:rounded-r-xl transition-colors">
                    {patient?.medicalId}
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] p-4 text-sm text-gray-900 font-light first:rounded-l-xl last:rounded-r-xl transition-colors">
                    {patient?.patientId || "-"}
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] p-4 text-sm text-gray-900 font-medium transition-colors">
                    {patient?.firstName} {patient?.lastName}
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] p-5 text-sm text-gray-900 font-light flex items-center gap-2 transition-colors">
                    <IoCalendar className="text-xl text-navy_blue" />
                    {patient?.recordings?.length > 0
                      ? moment(patient.recordings?.[0]?.createdAt).format(
                          "DD MMM, YYYY"
                        )
                      : "NA"}
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] p-4 text-sm text-gray-900 font-light transition-colors">
                    {patient?.recordings?.length > 0
                      ? patient.recordings?.[0]?.audio?.duration
                      : "NA"}
                  </td>
                  <td className="bg-[#FAFAFA] group-hover:bg-[#ededed] first:rounded-l-xl last:rounded-r-xl p-4 transition-colors">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPatient(patient);
                        navigate(`/recordings?patientId=${patient.id}`);
                      }}
                      className="inline-flex items-center underline text-navy_blue hover:text-hover_effect text-sm font-medium"
                    >
                      View
                 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <h3 className="text-2xl font-medium text-gray mb-2">
            No Patients Found
          </h3>
          <p className="text-gray text-center mb-6 max-w-md">
            Get started by adding your first patient to begin tracking their
            records and sessions.
          </p>
          <div className="w-[250px] mx-auto">
            <Button
              onClick={handleClick}
              outline={true}
              label="Add New Patient"
              IconLeft={() => (
                <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
              )}
            />
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center my-6 pb-4">
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            outline={true}
            label={isFetchingNextPage ? "Loading..." : "Load More Patients"}
            IconLeft={() =>
              isFetchingNextPage ? (
                <div className="w-5 h-5 border-2 border-navy_blue border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
              )
            }
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Patients"
        message="Are you sure you want to delete the selected patients? This will also delete all their recordings and cannot be undone."
      />
    </div>
  );
};

export default AllPatients;
