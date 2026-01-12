import { Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import ForgotPassword from "../screens/auth/forgotPassword";
import AboutUs from "../screens/auth/landing/aboutus";
import Contact from "../screens/auth/landing/contact";
import Faqs from "../screens/auth/landing/faqs";
import Home from "../screens/auth/landing/home";
import HowItWorks from "../screens/auth/landing/howItWorks";
import OurJourney from "../screens/auth/landing/ourjourney";
import Pricing from "../screens/auth/landing/pricing";
import Resources from "../screens/auth/landing/resources";
import Login from "../screens/auth/login";
import OtpVerification from "../screens/auth/otpVerification";
import ResetPassword from "../screens/auth/resetPassword";
import Signup from "../screens/auth/signup";
import Verify2FA from "../screens/auth/verify-2fa";
import VerifyEmail from "../screens/auth/VerifyEmail";
import Terms from "../screens/auth/landing/terms";
import Privacy from "../screens/auth/landing/privacy";

// const NotFound = () => {
//   return (
//     <div className="flex h-full w-full  items-center justify-center text-3xl font-bold">
//       Not Found!
//     </div>
//   );
// };

export function AuthNavigation() {
  return (
    <div className="h-full">
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how_it_works" element={<HowItWorks />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/our_journey" element={<OurJourney />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/otp_verification" element={<OtpVerification />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}
