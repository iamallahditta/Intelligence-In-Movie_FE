import React, { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../../hooks/auth/useUser";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
const ManageSubscription = () => {
  const { subscription, setSubscription } = useUser();
  const [subscriptionFetched, setSubscriptionFetched] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await axios.post("/v1/api/subscription/cancel", {
        userId: user.id,
      });

      const { data } = await axios.post("/v1/api/subscription/details", {
        userId: user.id,
      });
      setSubscription(data);
      setIsCancelling(false);
      toast.success(res.data.message);
    } catch (err) {
      setIsCancelling(false);
      console.error("Cancel error:", err);
      toast.error("Failed to cancel subscription.");
    }
  };

  console.log(subscription);

  // Fetch subscription info
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data } = await axios.post("/v1/api/subscription/details", {
          userId: user.id,
        });
        setSubscription(data);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setSubscriptionFetched(true);
      }
    };

    if (user?.id) {
      fetchSubscription();
    } else {
      setSubscriptionFetched(true);
    }
  }, [user?.id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // ⬅️ Move this inside
    const success = queryParams.get("checkout") === "success";
    const cancelled = queryParams.get("cancelled") === "true";

    setShowSuccess(success);
    setShowCancelled(cancelled);

    // Remove query params from URL
    if (success || cancelled) {
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [location.search]);

  // Don't render anything until subscription fetch is complete - let global loader handle it
  if (user === "loading" || !subscriptionFetched) {
    return <Loader />;
  }

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-1">Manage Subscription</h1>
        <p className="text-sm text-gray-600 mb-6">
          View and update your current plan and billing preferences.
        </p>
      </div>

      {showSuccess && (
        <div className="relative bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded-md mb-4">
          ✅ Subscription successful! Welcome aboard.
          <button
            onClick={() => setShowSuccess(false)}
            className="absolute top-2 right-3 text-green-800 hover:text-green-600 text-lg"
          >
            &times;
          </button>
        </div>
      )}

      {showCancelled && (
        <div className="relative bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-3 rounded-md mb-4">
          ⚠️ You cancelled the checkout. Your subscription has not been changed.
          <button
            onClick={() => setShowCancelled(false)}
            className="absolute top-2 right-3 text-yellow-800 hover:text-yellow-600 text-lg"
          >
            &times;
          </button>
        </div>
      )}

      {/* Subscription Card */}
      {/* {subscription ? (
        <div className="bg-[#FAFAFA] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                {subscription?.interval === "MONTHLY" ? "Monthly" : "Yearly"}{" "}
                Subscription
              </h2>
              {subscription?.plan === "BASIC" ? (
                ""
              ) : (
                <p className="text-sm text-gray-500">
                  Next payment:{" "}
                  <span className="font-medium">
                    {new Date(subscription.nextBillingDate).toDateString()}
                  </span>
                </p>
              )}
            </div>

            <span
              className={`text-sm px-3 py-1 rounded-md ${
                subscription?.status === "active"
                  ? "bg-[#EAFFCB] text-[#577D0F]"
                  : "bg-[#FEE2E2] text-[#AD1818]"
              }`}
            >
              {subscription?.status?.charAt(0)?.toUpperCase() +
                subscription?.status?.slice(1)}
            </span>
          </div>

          <div className="border border-[#B0B0B0] rounded-md px-4 py-3 flex justify-between items-center">
            <span className="text-base font-medium">{subscription?.plan}</span>
            <span className="text-sm text-gray-600">
              {" "}
              ${subscription?.price}/{subscription?.interval}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFF0F0] p-4 rounded-md text-red-700">
          No active subscription found.
        </div>
      )} */}

      {subscription ? (
        subscription.status === "canceled" ? (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-6">
         Your access has been paused due to a canceled subscription. Pick a new plan to get back to all the premium benefits.
          </div>
        ) : (
          <div className="bg-[#FAFAFA] rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {subscription?.interval === "MONTHLY" ? "Monthly" : "Yearly"}{" "}
                  Subscription
                </h2>
                {subscription?.plan === "BASIC" ? (
                  ""
                ) : (
                  <p className="text-sm text-gray-500">
                    Next payment:{" "}
                    <span className="font-medium">
                      {new Date(subscription.nextBillingDate).toDateString()}
                    </span>
                  </p>
                )}
              </div>

              <span
                className={`text-sm px-3 py-1 rounded-md ${
                  subscription?.status === "active"
                    ? "bg-[#EAFFCB] text-[#577D0F]"
                    : "bg-[#FEE2E2] text-[#AD1818]"
                }`}
              >
                {subscription?.status?.charAt(0)?.toUpperCase() +
                  subscription?.status?.slice(1)}
              </span>
            </div>

            <div className="border border-[#B0B0B0] rounded-md px-4 py-3 flex justify-between items-center">
              <span className="text-base font-medium">
                {subscription?.plan === 'BASIC' ? 'Free' : subscription?.plan}
              </span>
              <span className="text-sm text-gray-600">
                ${subscription?.price}/{subscription?.interval}
              </span>
            </div>
          </div>
        )
      ) : (
        <div className="bg-[#FFF0F0] p-4 rounded-md text-red-700">
          No active subscription found.
        </div>
      )}

      {subscription && (
        <div className="p-4 rounded-2xl  bg-white border border-gray-200 w-fit mb-6">
          <h3 className="text-gray-600 text-sm font-medium mb-1">Note Limit</h3>
          <div className="text-xl font-semibold text-gray-900">
            {subscription?.notesPerMonth === null
              ? "Unlimited"
              : subscription?.notesPerMonth}{" "}
            / {(subscription?.data?.interval) === "MONTHLY" ? "month" : "year"}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-[#FAFAFA] rounded-lg p-6 space-y-2 ">
        <Link
          to="/subscription"
          className="block text-[#002366] font-medium hover:underline"
        >
          {subscription?.status === "canceled"
            ? "Subscribe Again"
            : "Change Plan"}
        </Link>
        <hr className=" text-[#B0B0B0]" />
        {subscription && subscription.status !== "canceled" && (
          <div>
            {subscription?.canceled_at && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 my-4 rounded-lg shadow-sm w-fit">
                <span className="font-semibold">Canceled On:</span>{" "}
                {new Date(subscription.canceled_at).toDateString()}
              </p>
            )}
            {subscription?.cancel_at ? (
              <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200  px-4 py-2 rounded-lg shadow-sm w-fit">
                <span className="font-semibold">Scheduled Cancellation:</span>{" "}
                {new Date(subscription.cancel_at).toDateString()}
              </p>
            ) : subscription?.plan === "BASIC" ? (
              ""
            ) : (
              <button
                disabled={isCancelling}
                onClick={handleCancel}
                className="block text-left text-[#AD1818] font-medium hover:underline w-full"
              >
                {isCancelling
                  ? "Processing Cancellation..."
                  : "Cancel My Subscription"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubscription;
