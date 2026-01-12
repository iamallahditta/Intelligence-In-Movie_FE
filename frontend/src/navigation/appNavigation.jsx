import { Route, Routes } from "react-router-dom";

import { useEffect, useRef } from "react";
import Wrapper from "../components/wrapper";
import usePatients from "../hooks/usePatients";
import useRecordings from "../hooks/useRecordings";
import { usePatientsQuery } from "../hooks/usePatientsQuery";
import AllPatients from "../screens/app/allPatients";
import AllRecordings from "../screens/app/allRecordings";
import EditorPage from "../screens/app/editor";
import ManageSubscription from "../screens/app/manageSubscription";
import PatientRecordings from "../screens/app/patientRecordings";
import Profile from "../screens/app/profile";
import Recording from "../screens/app/recording";
import Subscription from "../screens/app/subscription";
import PreSubscription from "../screens/app/preSubscription";
import Security from "../screens/app/Security";
import Contact from "../screens/app/contact";

// const NotFound = () => {
//   return (
//     <div className="flex h-full w-full  items-center justify-center text-3xl font-bold">
//       Not Found!
//     </div>
//   );
// };

export function AppNavigation() {
  const { setRecordings } = useRecordings();
  const { setPatients, setLoading } = usePatients();
  const { data: patients = [], isLoading } = usePatientsQuery();
  const patientsHashRef = useRef(null);

  // Sync React Query data with Zustand store for backward compatibility
  // Only update if data actually changed to prevent infinite loops
  useEffect(() => {
    if (!Array.isArray(patients)) return;

    // Create a simple hash based on patient IDs to detect changes
    const patientsHash = patients.map(p => p?.id || '').join(',');
    
    // Only update if the hash changed (meaning patients actually changed)
    if (patientsHashRef.current !== patientsHash) {
      patientsHashRef.current = patientsHash;
      setPatients(patients);
    }
  }, [patients, setPatients]);

  // Separate effect for loading state to avoid unnecessary updates
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<AllPatients />} />
        <Route path="/recordings" element={<AllRecordings />} />
        <Route path="/patient_recordings" element={<PatientRecordings />} />
        <Route path="/recording" element={<Recording />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/manage-subscription" element={<ManageSubscription />} />
        <Route path="/security" element={<Security />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/pre_subscription" element={<PreSubscription />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Wrapper>
  );
}
