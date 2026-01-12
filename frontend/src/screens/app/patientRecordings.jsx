import Button from "../../components/Button";
import FullScreenRecording from "../../components/fullScreenRecording";
import PrevRecord from "../../components/prevRecord";
import React, { useEffect } from "react";
import useAddPatientModal from "../../hooks/modal/useAddPatientModal";
import useFullScreenRecording from "../../hooks/useFullScreenRecording";
import { useNavigate, useLocation } from "react-router-dom";
import useRecordingData from "../../hooks/useRecordingData";
import useRecordings from "../../hooks/useRecordings";
import usePatients from "../../hooks/usePatients";
import { usePatientQuery } from "../../hooks/usePatientsQuery";
import axios from "axios";
import toast from "react-hot-toast";

const PatientRecordings = () => {

    const {
      activeRecording,
    recordings,
    setRecordings,
    setActiveRecording,
    setIsRecordLoading,
    isRecordLoading,
  } = useRecordings();

  const { patient, setPatient } = useRecordingData();
  const { setLoading } = usePatients();
  const location = useLocation();
  const navigate = useNavigate();
  const addPatientModal = useAddPatientModal();
  const { showFullScreenRecording } = useFullScreenRecording();

  // Get patient ID from URL params
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get('patientId');

  // Fetch patient from React Query if ID is in URL but not in store
  const { data: patientFromQuery, isLoading: isLoadingPatient, isFetching: isFetchingPatient, isError: isPatientError } = usePatientQuery(
    patientIdFromUrl && !patient ? patientIdFromUrl : null
  );

  // Set patient from React Query if available and not in store
  useEffect(() => {
    if (patientFromQuery && !patient) {
      setPatient(patientFromQuery);
    }
  }, [patientFromQuery, patient, setPatient]);

  // Get current patient (from store or query)
  const currentPatient = patient || patientFromQuery;
  
  // Determine if we're still waiting for patient data
  const isWaitingForPatient = isLoadingPatient || isFetchingPatient || (patientIdFromUrl && !currentPatient);
  
  // Determine if we're still loading (patient or recordings)
  const isStillLoading = isWaitingForPatient || (currentPatient && isRecordLoading);
  
  // Update global loader state - this will show the global loader until both patient and recordings are loaded
  useEffect(() => {
    setLoading(isStillLoading);
  }, [isStillLoading, setLoading]);

    const fetchRecordings = async () => {
     
    try {
      // Don't fetch if we're still loading patient data
      if (isWaitingForPatient) {
        return;
      }

      // Only navigate if patientId was in URL but fetch failed or no patient found
      if (!currentPatient?.id) {
        if (patientIdFromUrl) {
          // Patient ID was in URL but fetch failed or patient not found
          console.log("Patient not found for ID:", patientIdFromUrl);
          if (isPatientError) {
            toast.error("Failed to load patient information");
          }
        } else {
          // No patient ID in URL and no patient in store
          console.log("No patient ID available");
        }
        navigate("/recordings");
        return;
      }

      const { data } = await axios.get(`/v1/api/record/patient/${currentPatient.id}`);

      console.log("data is", data);
      const fetchedRecordings = data?.data?.records || [];
      setRecordings(fetchedRecordings);
      
      // Preserve the selected recording if it exists in the fetched recordings
      // Otherwise, set the first recording as active
      if (activeRecording) {
        const selectedRecording = fetchedRecordings.find(
          (rec) => rec.id === activeRecording.id
        );
        if (selectedRecording) {
          // Keep the selected recording (update it with fresh data)
          setActiveRecording(selectedRecording);
        } else if (fetchedRecordings.length > 0) {
          // Selected recording not found, fall back to first
          setActiveRecording(fetchedRecordings[0]);
        }
      } else if (fetchedRecordings.length > 0) {
        // No active recording set, use the first one
        setActiveRecording(fetchedRecordings[0]);
      }
      
      setIsRecordLoading(false);
    } catch (error) {
      console.log("Error fetching recordings:", error);
      toast.error("Something went wrong!");
      setRecordings([]); // Set empty array on error
      setIsRecordLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch recordings if patient is loaded (not loading)
    if (!isWaitingForPatient) {
      setIsRecordLoading(true);
      fetchRecordings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id, patientFromQuery?.id, isWaitingForPatient]);

  // Return null while loading - global loader will handle the display
  // This ensures the global loader shows until both patient and recordings are loaded
  if (isStillLoading) {
    return null;
  }

  // Show message if no patient is available (only if not loading and no patientId in URL)
  if (!currentPatient && !patientIdFromUrl) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <h2 className="text-xl font-medium text-gray-600 mb-4">No patient selected</h2>
        <Button
          onClick={() => navigate("/")}
          label="Go to Patients"
          outline={true}
        />
      </div>
    );
  }

  return activeRecording ? (
    showFullScreenRecording ? <FullScreenRecording /> : <PrevRecord />
  ) : (
    <div className="flex flex-col  w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to AI Medical!</h1>
        <h2 className="font-light my-3 text-center mx-2">
          Get started by creating your first recording or entering patient
          information.
        </h2>
        <div className="w-[150px]">
          <Button onClick={()=>{
            if(currentPatient)
            {
              navigate('/recording')
            }
          }} label="Start Recording" />
        </div>
      </div>
    </div>
  );
};

export default PatientRecordings;
