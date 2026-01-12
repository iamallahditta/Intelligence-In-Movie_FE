import { AppNavigation } from "./navigation/appNavigation";
import { AuthNavigation } from "./navigation/authNavigation";
import Loading from "./screens/auth/loading";
import React from "react";
import { Toaster } from "react-hot-toast";
import useAuth from "./hooks/auth/useAuth";
import useUser from "./hooks/auth/useUser";

const App = () => {
  useAuth();
  const { user } = useUser();

  
  return <>
   <Toaster />
   {user === 'loading' ? <Loading /> :
    user ? <AppNavigation /> :
    <AuthNavigation />
    }
   </>
  
};

export default App;
