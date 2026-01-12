

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import Button from "../../components/Button";
// import toast from "react-hot-toast";
// import useToken from "../../hooks/auth/useToken";

// export default function Verify2FA() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { setToken } = useToken();

//   const { email, twoFaEmail, twoFaPhone } = location.state || {};

//   const [otpEmail, setOtpEmail] = useState("");
//   const [otpSms, setOtpSms] = useState("");
//   const [loading, setLoading] = useState(false);

//   const verifyOtp = async () => {
//     if (twoFaEmail && !otpEmail) {
//       return toast.error("Enter Email OTP");
//     }
//     if (twoFaPhone && !otpSms) {
//       return toast.error("Enter SMS OTP");
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/v1/api/otp/verify-2fa", {
//         email,
//         otpEmail,
//         otpSms,
//       });

//       setToken(res?.data?.token);
//       setTimeout(() => {
//         navigate("/");
//       }, 1000);
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen flex justify-center items-center bg-white">
//       <div className="bg-light_gray p-8 rounded-lg shadow w-96 space-y-4">
//         <h1 className="text-2xl font-bold text-center">
//           Two-Factor Authentication
//         </h1>
//         <p className="text-center text-gray-600">Enter the OTP sent:</p>

     

//         {twoFaEmail && (
//           <input
//             type="text"
//             placeholder="Enter Email OTP"
//             value={otpEmail}
//             onChange={(e) => setOtpEmail(e.target.value)}
//             className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}

//         {twoFaPhone && (
//           <input
//             type="text"
//             placeholder="Enter SMS OTP"
//             value={otpSms}
//             onChange={(e) => setOtpSms(e.target.value)}
//             className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}

//         <Button
//           label={loading ? "Verifying..." : "Verify OTP"}
//           onClick={verifyOtp}
//           disabled={loading}
//         />
//       </div>
//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import useToken from "../../hooks/auth/useToken";

export default function Verify2FA() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useToken();

  // Expect these from navigation state
  const { email, twoFaEmail, twoFaPhone } = location.state || {};

  // Form state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSms, setOtpSms] = useState("");
  const [loading, setLoading] = useState(false);

  // Inline validation errors
  const [errEmailField, setErrEmailField] = useState("");
  const [errSmsField, setErrSmsField] = useState("");
  const [formStatusMsg, setFormStatusMsg] = useState("");

  // Resend cooldown
  const [resendTimer, setResendTimer] = useState(0);

  /* ----------------- EFFECTS ----------------- */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ----------------- HELPERS ----------------- */
  // Mask email: keep first 2 chars + domain, mask middle local-part
  const maskEmail = (e) => {
    if (!e) return "";
    const [local, domain] = e.split("@");
    if (!domain) return e;
    const visible = local.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(local.length - 2, 0))}@${domain}`;
  };

  // Mask phone: keep country & first 2‑3 digits after it, mask rest except last 2
  const maskPhone = (p) => {
    if (!p) return "";
    // Strip spaces but keep +
    const raw = p.replace(/\s+/g, "");
    const match = raw.match(/^(\+\d{1,4})(\d+)?$/);
    if (!match) return p;
    const country = match[1];
    const rest = match[2] || "";
    if (rest.length <= 4) return `${country}${rest}`;
    const keepStart = rest.slice(0, 3);
    const keepEnd = rest.slice(-2);
    return `${country} ${keepStart}${"*".repeat(Math.max(rest.length - 5, 1))}${keepEnd}`;
  };

  // Consolidated resend label
  const resendLabel = (() => {
    if (resendTimer > 0) return `Resend in ${resendTimer}s`;
    if (twoFaEmail && twoFaPhone) return "Resend Email & SMS Codes";
    if (twoFaEmail) return "Resend Email Code";
    if (twoFaPhone) return "Resend SMS Code";
    return "Resend Code";
  })();

  // Basic OTP format check (optional; relax if backend tolerates)
  const isOtpValidFormat = (val) => /^[0-9A-Za-z]{4,8}$/.test(val.trim());

  /* ----------------- ACTIONS ----------------- */
  const verifyOtp = async () => {
    // Reset inline errors
    setErrEmailField("");
    setErrSmsField("");
    setFormStatusMsg("");

    // Required checks
    if (twoFaEmail && !otpEmail.trim()) {
      setErrEmailField("Email code required.");
    } else if (twoFaEmail && !isOtpValidFormat(otpEmail)) {
      setErrEmailField("Invalid format. Enter the 6‑digit code we emailed you.");
    }

    if (twoFaPhone && !otpSms.trim()) {
      setErrSmsField("SMS code required.");
    } else if (twoFaPhone && !isOtpValidFormat(otpSms)) {
      setErrSmsField("Invalid format. Enter the 6‑digit code we texted you.");
    }

    // If any errors, surface and stop
    if (errEmailField || errSmsField) {
      setFormStatusMsg("Please fix the errors above and try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/v1/api/otp/verify-2fa", {
        email,
        otpEmail: otpEmail.trim(),
        otpSms: otpSms.trim(),
      });

      toast.success("Verification successful! Redirecting...");
      setToken(res?.data?.token);
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      // Map backend error to inline fields when possible
      const apiMsg = error?.response?.data?.message?.toLowerCase?.() || "";

      if (apiMsg.includes("email") && apiMsg.includes("expire")) {
        setErrEmailField("Code expired. Please resend a new email code.");
      } else if (apiMsg.includes("email") && (apiMsg.includes("invalid") || apiMsg.includes("incorrect"))) {
        setErrEmailField("Incorrect email code. Please try again.");
      }

      if ((apiMsg.includes("phone") || apiMsg.includes("sms")) && apiMsg.includes("expire")) {
        setErrSmsField("Code expired. Please resend a new SMS code.");
      } else if ((apiMsg.includes("phone") || apiMsg.includes("sms")) && (apiMsg.includes("invalid") || apiMsg.includes("incorrect"))) {
        setErrSmsField("Incorrect SMS code. Please try again.");
      }

      // Generic fallback
      const errMsg =
        error?.response?.data?.message ||
        "Verification failed. Please check your codes and try again.";
      setFormStatusMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast.error("Missing email. Please go back and start sign‑in again.");
      return;
    }

    // Start cooldown immediately to prevent spamming
    setResendTimer(30);

    try {
      // Pass flags so backend knows what to send
      await axios.post("/v1/api/otp/send-2fa-otp", {
        email,
     
      });
      toast.success("New verification code sent successfully.");
    } catch (error) {
      setResendTimer(0); // reset if failed
      const errMsg =
        error?.response?.data?.message ||
        "We couldn't resend the code. Please try again.";
      toast.error(errMsg);
    }
  };

  /* ----------------- RENDER ----------------- */
  return (
    <div className="h-screen flex justify-center items-center bg-white px-4">
      <div className="bg-light_gray p-8 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Two-Factor Authentications</h1>

        <p className="text-center text-gray-600 text-sm leading-relaxed">
          Enter the code{twoFaEmail && !twoFaPhone && " we emailed you"}
          {twoFaPhone && !twoFaEmail && " we texted you"}
          {twoFaEmail && twoFaPhone && "s we sent"} to:
          {twoFaEmail && (
            <span className="block mt-1 text-gray-700 text-sm">
               {maskEmail(email)}
            </span>
          )}
          {twoFaPhone && (
            <span className="block mt-1 text-gray-700 text-sm">
               {maskPhone(twoFaPhone)}
            </span>
          )}
        </p>

        {twoFaEmail && (
          <div className="mt-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Email Code"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              onBlur={() => {
                if (!otpEmail.trim()) setErrEmailField("Email code required.");
                else if (!isOtpValidFormat(otpEmail))
                  setErrEmailField("Invalid format. Should be 6 digits.");
                else setErrEmailField("");
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errEmailField ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
              }`}
              aria-label="Email verification code"
            />
            <p className="mt-1 text-xs text-gray-500">
              Check your inbox (and spam). Code expires in 5 minutes.
            </p>
            {errEmailField && (
              <p className="mt-1 text-xs text-red">{errEmailField}</p>
            )}
          </div>
        )}

        {twoFaPhone && (
          <div className="mt-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="SMS Code"
              value={otpSms}
              onChange={(e) => setOtpSms(e.target.value)}
              onBlur={() => {
                if (!otpSms.trim()) setErrSmsField("SMS code required.");
                else if (!isOtpValidFormat(otpSms))
                  setErrSmsField("Invalid format. Should be 6 digits.");
                else setErrSmsField("");
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errSmsField ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
              }`}
              aria-label="SMS verification code"
            />
            <p className="mt-1 text-xs text-gray-500">
              We texted a code to your phone. Code expires in 5 minutes.
            </p>
            {errSmsField && (
              <p className="mt-1 text-xs text-red">{errSmsField}</p>
            )}
          </div>
        )}

        {/* {formStatusMsg && (
          <div className="text-center text-sm mt-2 text-red">{formStatusMsg}</div>
        )} */}

        <Button
          label={loading ? "Verifying..." : "Verify"}
          onClick={verifyOtp}
          disabled={loading}
          className="w-full mt-4"
        />

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendTimer > 0}
            className={`text-sm font-medium ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}
          >
            {resendLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
