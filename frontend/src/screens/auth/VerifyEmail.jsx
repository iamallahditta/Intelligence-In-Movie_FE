import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useToken from "../../hooks/auth/useToken";
import useUser from "../../hooks/auth/useUser";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useToken();
  const { setUser } = useUser();

  const { email } = location.state || {};

  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyOtp = async () => {
  if (!otpEmail) {
    return toast.error("Please enter the OTP sent to your email.");
  }

    setLoading(true);
    try {
      const res = await axios.post("/v1/api/otp/verify?token=true", {
        email,
        otp: otpEmail,
      });

      console.log(res);

      setToken(res?.data?.token);
      // setUser(res?.data?.user);
      toast.success(" Your email has been successfully verified!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "The OTP you entered is incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      await axios.post("/v1/api/otp/send", { email , emailType:"verify"});
     toast.success(" A new OTP has been sent to your email address.");
    } catch (error) {
      console.error(error);
     toast.error("⚠️ Couldn't resend OTP. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="bg-light_gray p-8 rounded-lg shadow w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Email Verification</h1>
        <p className="text-center text-gray-600">
          We’ve sent a One-Time Password (OTP) to your email. Please enter it below to verify your account.
        </p>

        <input
          type="text"
          placeholder="Enter Email OTP"
          value={otpEmail}
          onChange={(e) => {
            // Allow only numbers and limit to 6 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtpEmail(value);
          }}
          onPaste={(e) => {
            e.preventDefault();
            // Get pasted text and extract only numbers, limit to 6 digits
            const pastedText = e.clipboardData.getData('text');
            const numbersOnly = pastedText.replace(/\D/g, '').slice(0, 6);
            setOtpEmail(numbersOnly);
          }}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          label={loading ? "Verifying OTP..." : "Verify Email"}
          onClick={verifyOtp}
          disabled={loading}
        />

        <button
          onClick={resendOtp}
          disabled={resending}
          className="w-full text-sm text-blue-600 hover:underline mt-2 disabled:opacity-50"
        >
          {resending ? "Sending a new OTP..." : "Didn’t get the code? Resend OTP"}
        </button>
      </div>
    </div>
  );
}
