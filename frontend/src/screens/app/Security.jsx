"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import axios from "axios";
import useUser from "../../hooks/auth/useUser";
import toast from "react-hot-toast";

const EmailSchema = z.object({
  twoFaEmail: z.string().email({ message: "Enter a valid email" }),
});

const SmsSchema = z.object({
  twoFaPhone: z.string().min(4, "Phone number required"),
});

export default function Security() {
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [smsOtp, setSmsOtp] = useState("");
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [showSmsOtpInput, setShowSmsOtpInput] = useState(false);

  const { user, setUser } = useUser();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: { twoFaEmail: user?.email || "" },
  });

  const {
    handleSubmit: handleSubmitPhone,
    setValue: setPhoneValue,
    watch: watchPhone,
    reset: resetPhone,
    formState: { errors: phoneErrors },
  } = useForm({
    resolver: zodResolver(SmsSchema),
    defaultValues: { twoFaPhone: user?.phone || "" },
  });

  const twoFaPhone = watchPhone("twoFaPhone");

  const sendEmailOtpCode = async (values) => {
    try {
      setLoadingEmail(true);
      await axios.post("/v1/api/otp/send-email-otp-code", {
        email: values.twoFaEmail,
        twoFaType: "twofa",
      });
      setShowEmailOtpInput(true);
      toast.success("A verification code has been sent to your email.");
      setLoadingEmail(false);
    } catch (error) {
      setLoadingEmail(false);
      toast.error("Unable to send verification code. Please try again.");
    }
  };

  const verifyAndEnableEmailOtp = async (values) => {
    try {
      setLoadingEmail(true);
      await axios.post("/v1/api/otp/verify-email-otp", {
        email: values.twoFaEmail,
        otp: emailOtp,
      });
      const { data } = await axios.post("/v1/api/otp/enable-email-otp", {
        userId: user?.id,
        twoFaEmail: values.twoFaEmail,
      });
      toast.success(data.message);
      setUser({
        ...user,
        twoFaEmail: values.twoFaEmail,
        is2faEnabled: data.is2faEnabled,
      });
      setShowEmailOtpInput(false);
      setEmailOtp("");
    } catch (error) {
      toast.error(
        "The verification code you entered is incorrect. Please try again."
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  
  const handleDisableEmailOtp = async () => {
    try {
      setLoadingEmail(true);
      await axios.post("/v1/api/otp/send-email-otp-code", {
        email: user?.email,
        twoFaType: "twofaDisable",
      });
      setShowEmailOtpInput(true);
      toast.success("A verification code has been sent to your email.");
      setLoadingEmail(false);
    } catch (error) {
      setLoadingEmail(false);
      toast.error("Unable to send verification code. Please try again.");
    }
  };

  const verifyAndDisableEmailOtp = async () => {
    try {
      setLoadingEmail(true);
      await axios.post("/v1/api/otp/verify-email-otp", {
        email: user?.email,
        otp: emailOtp,
      });
      const { data } = await axios.post("/v1/api/otp/disable-email-otp", {
        userId: user?.id,
      });
      toast.success(data.message);
      setUser({ ...user, twoFaEmail: null, is2faEnabled: data.is2faEnabled });
      setShowEmailOtpInput(false);
      setEmailOtp("");
    } catch (error) {
      toast.error(
        "The verification code you entered is incorrect. Please try again."
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  const sendSmsOtpCode = async () => {
    try {
      setLoadingSms(true);
      await axios.post("/v1/api/otp/send-sms-otp-code", {
        phone: "+" + twoFaPhone,
      });
      setShowSmsOtpInput(true);
      toast.success("A verification code has been sent to your phone.");
      setLoadingSms(false);
    } catch (error) {
      setLoadingSms(false);
      toast.error("Unable to send SMS verification code. Please try again.");
    }
  };

  const verifyAndEnableSmsOtp = async () => {
    try {
      setLoadingSms(true);
      await axios.post("/v1/api/otp/verify-sms-otp", {
        phone: "+" + twoFaPhone,
        otp: smsOtp,
      });
      const { data } = await axios.post("/v1/api/otp/enable-sms-otp", {
        userId: user?.id,
        twoFaPhone: "+" + twoFaPhone,
      });
      toast.success(data.message);
      setUser({
        ...user,
        twoFaPhone: twoFaPhone,
        is2faEnabled: data.is2faEnabled,
      });
      setShowSmsOtpInput(false);
      setSmsOtp("");
    } catch (error) {
      toast.error(
        "The verification code you entered is incorrect. Please try again."
      );
    } finally {
      setLoadingSms(false);
    }
  };

  const verifyAndDisableSmsOtp = async () => {
    try {
      setLoadingSms(true);
      await axios.post("/v1/api/otp/verify-sms-otp", {
        phone: "+" + user?.twoFaPhone,
        otp: smsOtp,
      });
      const { data } = await axios.post("/v1/api/otp/disable-sms-otp", {
        userId: user?.id,
      });
      toast.success(data.message);
      setUser({ ...user, twoFaPhone: null, is2faEnabled: data.is2faEnabled });
      setShowSmsOtpInput(false);
      setSmsOtp("");
    } catch (error) {
      toast.error(
        "The verification code you entered is incorrect. Please try again."
      );
    } finally {
      setLoadingSms(false);
    }
  };

  useEffect(() => {
    if (user) {
      resetEmail({ twoFaEmail: user?.email || "" });
      resetPhone({ twoFaPhone: user?.phone || "" });
    }
  }, [user]);

  return (
    <div className="bg-white p-6 space-y-4">
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-1">Security (2FA)</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enable extra security with email or mobile verification.
        </p>
      </div>

      <form
        onSubmit={handleSubmitEmail(sendEmailOtpCode)}
        className="bg-[#FAFAFA] rounded-lg p-6 mb-6 space-y-4"
      >
        <h2 className="font-semibold mb-2">Email OTP</h2>
        <input
          type="email"
          {...registerEmail("twoFaEmail")}
          disabled
          placeholder="Enter email"
          className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            emailErrors.twoFaEmail ? "border-red-500" : "focus:ring-blue-500"
          }`}
        />
        {emailErrors.twoFaEmail && (
          <p className="text-red text-sm mt-1">
            {emailErrors.twoFaEmail.message}
          </p>
        )}

        {showEmailOtpInput && (
          <div className="space-y-2">
            <input
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              placeholder="Enter Email OTP"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="max-w-fit">
              <Button
                type="button"
                outline={true}
                label={
                  user?.twoFaEmail
                    ? loadingEmail
                      ? "Disabling..."
                      : "Verify Code & Disable Email 2FA"
                    : loadingEmail
                    ? "Enabling..."
                    : "Verify Code & Enable Email 2FA"
                }
                onClick={
                  user?.twoFaEmail
                    ? verifyAndDisableEmailOtp
                    : handleSubmitEmail(verifyAndEnableEmailOtp)
                }
                disabled={loadingEmail}
              />
            </div>
          </div>
        )}

        {!showEmailOtpInput && (
          <div className="max-w-fit">
            {user?.twoFaEmail ? (
              <Button
                type="button"
                outline={true}
                label={
                  loadingEmail ? "Disabling..." : "Disable Email Authentication"
                }
                disabled={loadingEmail}
                onClick={handleDisableEmailOtp}
              />
            ) : (
              <Button
                type="submit"
                outline={true}
                label={
                  loadingEmail ? "Enabling..." : "Enable Email Authentication"
                }
                disabled={loadingEmail}
              />
            )}
          </div>
        )}
      </form>

      <form
        onSubmit={handleSubmitPhone(sendSmsOtpCode)}
        className="bg-[#FAFAFA] rounded-lg p-6 mb-6 space-y-4"
      >
        <h2 className="font-semibold mb-2">SMS OTP</h2>
        <PhoneInput
          country="us"
          enableSearch
          inputStyle={{
            marginLeft: "36px",
          }}
          disabled
          inputClass="!w-full !px-3 !py-2 !border !rounded-md !focus:outline-none"
          value={twoFaPhone}
          onChange={(phone) => setPhoneValue("twoFaPhone", phone)}
        />
        {phoneErrors.twoFaPhone && (
          <p className="text-red text-sm mt-1">
            {phoneErrors.twoFaPhone.message}
          </p>
        )}

        {showSmsOtpInput && (
          <div className="space-y-2">
            <input
              value={smsOtp}
              onChange={(e) => setSmsOtp(e.target.value)}
              placeholder="Enter SMS OTP"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="max-w-fit">
              <Button
                type="button"
                outline={true}
                label={
                  user?.twoFaPhone
                    ? loadingSms
                      ? "Disabling..."
                      : "Verify Code & Disable SMS 2FA"
                    : loadingSms
                    ? "Enabling..."
                    : "Verify Code & Enable SMS 2FA"
                }
                onClick={
                  user?.twoFaPhone
                    ? verifyAndDisableSmsOtp
                    : verifyAndEnableSmsOtp
                }
                disabled={loadingSms}
              />
            </div>
          </div>
        )}

        {!showSmsOtpInput && (
          <div className="max-w-fit">
            {user?.twoFaPhone ? (
              <Button
                type="button"
                outline={true}
                label={
                  loadingSms ? "Disabling..." : "Disable SMS Authentication"
                }
                disabled={loadingSms}
                onClick={() => setShowSmsOtpInput(true)}
              />
            ) : (
              <Button
                type="submit"
                outline={true}
                label={loadingSms ? "Enabling..." : "Enable SMS Authentication"}
                disabled={loadingSms}
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
}
