import { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FaHandPointRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import useToken from "../../hooks/auth/useToken";
import useUser from "../../hooks/auth/useUser";

const Subscription = () => {
  const { token } = useToken();
  const { subscription, setSubscription } = useUser();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const [interval, setInterval] = useState("MONTHLY");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [clickedPlan, setClickedPlan] = useState(null);

  const handleToggle = () => {
    setInterval(interval === "MONTHLY" ? "YEARLY" : "MONTHLY");
  };

  console.log(subscription);
  const monthlyPrice = 79;
  const yearlyPrice = 69 * 12;
  const savedAmount = monthlyPrice * 12 - yearlyPrice;

  const SubscriptionPlan = {
    BASIC: "BASIC",
    PRO: "PRO",
    ENTERPRISE: "ENTERPRISE",
  };

  function getPlanLabel(
    currentPlan,
    targetPlan,
    currentInterval = "monthly",
    targetInterval = "monthly"
  ) {
    const priority = {
      BASIC: 1,
      PRO: 2,
      ENTERPRISE: 3,
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    // if cancelled

    if (subscription?.status === "canceled") {
      return `Subscribe to ${capitalize(targetPlan.toLowerCase())}`;
    }

    // Block downgrade to BASIC if already PRO or ENTERPRISE
    if (
      (currentPlan === "PRO" || currentPlan === "ENTERPRISE") &&
      targetPlan === "BASIC"
    ) {
      return "Downgrade to Basic Not Allowed";
    }

    // Handle PRO Monthly to PRO Yearly upgrade
    if (
      currentPlan === "PRO" &&
      targetPlan === "PRO" &&
      currentInterval === "MONTHLY" &&
      targetInterval === "YEARLY"
    ) {
      return "Upgrade to Pro Yearly";
    }

    // If same plan and same interval
    if (currentPlan === targetPlan && currentInterval === targetInterval) {
      return "Current Plan";
    }

    // General upgrade/downgrade logic
    if (priority[targetPlan] > priority[currentPlan]) {
      return `Upgrade to ${capitalize(targetPlan.toLowerCase())}`;
    } else {
      return `Downgrade to ${capitalize(targetPlan.toLowerCase())}`;
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const updateUserSubscription = async ({
    userId,
    newPlan,
    resetBillingCycle = false,
    noProration = false,
    coupon = null,
    interval = "YEARLY",
  }) => {
    try {
      const response = await axios.post("/v1/api/subscription/update", {
        userId,
        newPlan,
        resetBillingCycle,
        noProration,
        coupon,
        interval,
      });

      return response.data;
    } catch (err) {
      console.error(
        "Subscription Update Error:",
        err.response?.data?.error || err.message
      );
      throw new Error(
        err.response?.data?.error || "Subscription update failed"
      );
    }
  };

  // Fetch subscription info

  const handlePlanChange = async (selectedPlan) => {
    // Avoid duplicate click
    if (
      subscription?.status !== "canceled" &&
      selectedPlan === subscription?.plan &&
      interval === subscription?.interval
    ) {
      return;
    }

    setClickedPlan(selectedPlan);
    setButtonLoading(true);

    console.log(subscription);

    try {
      // If subscription is canceled — start a new checkout flow
      if (
        subscription?.plan == "BASIC" ||
        subscription?.status === "canceled"
      ) {
        const res = await axios.post("/v1/api/create-checkout-session", {
          plan: selectedPlan,
          token,
          interval,
        });

        window.location.href = res.data.url;
        return; // ⬅️ stop here
      }

      // Otherwise: update existing subscription
      const result = await updateUserSubscription({
        userId: user.id,
        newPlan: selectedPlan,
        resetBillingCycle: true,
        noProration: false,
        interval, // use current interval
      });

      navigate("/manage-subscription");
      toast.success("Your subscription plan has been updated successfully!");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setButtonLoading(false);
      setClickedPlan(null);
    }
  };

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
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  }, []);
  if (loading)
    return (
      <Loader text="Loading..." subtext="Wait We are Checking Subscription" />
    );

  return (
    <div>
      <div className="h-full w-full  flex flex-col">
        <div className="flex flex-row items-center justify-center mx-2 md:mx-10 mt-6">
          <h1 className="text-3xl font-bold tracking-wide text-black border-b-[4px] border-transparent">
            Pricing Plans
          </h1>
        </div>

        <p className="font-light text-[15px] mx-2 md:mx-10 mt-4 text-center">
          Choose best pricing plan for you
        </p>

        {/* Pricing Plans */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 lg:px-10 my-10 ">
          {/* Free plan */}
          <div className="w-full p-[1px] rounded-2xl overflow-hidden   ">
            <div className="w-full  bg-card shadow-lg bg-[#FAFAFA] border-soft_gray border-[1px] rounded-2xl  py-5">
              <div className="w-[95%] xl:w-[80%] 2xl:w-[60%]  mx-auto h-full flex flex-col  gap-1  ">
                <h1 class="bg-black text-3xl tracking-wider text-center font-semibold inline-block text-transparent bg-clip-text">
                  Free Forever Plan
                </h1>
                <p className="text-sm font-light text-center ">
                  For new users exploring AI-powered SOAP note generation.
                </p>
                {/* <p className="text-lg font-light text-center text-pink mt-3 mb-2">
                  <span className="font-semibold">$0 /month</span>
                </p> */}

                <div className="flex flex-col  items-start gap-6  my-4 ">
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Generate up to 15 clinical notes per Year
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Access to all pre-built templates
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Build your custom template
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      HIPAA and PIPEDA Compliance
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Custom PDF/Word output document
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      e-Signature option available
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Web-based access (desktop & mobile optimized)
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Try before you subscribe. No credit card required
                    </h1>
                  </div>
                </div>
                <button
                  disabled={buttonLoading && clickedPlan === "BASIC"}
                  // onClick={() => handlePlanChange("BASIC")}
                  className={`w-full cursor-pointer mx-auto m-4 rounded-2xl shadow-lg p-2 bg-soft_gray text-white`}
                >
                  {buttonLoading && clickedPlan === "BASIC" ? (
                    <h1 className="text-center font-semibold">Processing...</h1>
                  ) : (
                    <h1 className="text-center font-semibold">
                      {getPlanLabel(
                        subscription?.plan,
                        SubscriptionPlan?.BASIC
                      )}
                    </h1>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Pro Plan */}
          <div className="w-full p-[1px] rounded-2xl overflow-hidden   shadow-lg bg-[#FAFAFA] border-navy_blue border-[1px] relative">
            <img
              src="/assets/pricing/star.svg"
              className="absolute top-5 -left-2 "
            />
            <div className="w-full h-full bg-card   py-5">
              <div className="w-[95%] xl:w-[80%] 2xl:w-[60%]  mx-auto h-full flex flex-col  gap-1  ">
                <h1 class="bg-black text-3xl tracking-wider text-center font-semibold inline-block text-transparent bg-clip-text">
                  Pro Plan
                </h1>
                <p className="text-sm font-light text-center ">
                  Best for independent physicians and clinics needing unlimited
                  access.
                </p>

                <div className="text-center">
                  {/* Toggle Switch */}
                  <div className="flex justify-center mb-4">
                    <div className="flex bg-white rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-1">
                      <button
                        onClick={handleToggle}
                        className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                          interval === "MONTHLY"
                            ? "bg-[#002366] text-white shadow"
                            : "text-[#002366]"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={handleToggle}
                        className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                          interval === "YEARLY"
                            ? "bg-[#002366] text-white shadow"
                            : "text-[#002366]"
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <p className="text-lg font-light text-center text-[#002366] mt-3 mb-2">
                    <span className="font-semibold">
                      ${interval === "MONTHLY" ? monthlyPrice : yearlyPrice} /{" "}
                      {interval}
                    </span>
                  </p>

                  {/* Savings Info */}
                  {interval === "YEARLY" && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${savedAmount}/year compared to monthly
                    </p>
                  )}
                </div>

                <div className="flex flex-col  items-start gap-4  my-4 ">
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Access to all pre-built templates
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Build your custom template
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      HIPAA and PIPEDA Compliance
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Custom PDF/Word output document
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      e-Signature option available
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Web-based access (desktop & mobile optimized)
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Priority email support
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Future access to new templates & features
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">Cancel anytime</h1>
                  </div>
                </div>

                <button
                  disabled={buttonLoading && clickedPlan === "PRO"}
                  onClick={() => {
                    // Don't block if subscription is canceled
                    if (subscription?.status !== "canceled") {
                      // Disable click if already on same plan and interval
                      if (
                        subscription?.plan === SubscriptionPlan?.PRO &&
                        subscription?.interval === interval
                      ) {
                        return;
                      }

                      // Block downgrade from Yearly to Monthly
                      if (
                        subscription?.plan === SubscriptionPlan?.PRO &&
                        subscription?.interval === "YEARLY" &&
                        interval === "MONTHLY"
                      ) {
                        return;
                      }
                    }

                    handlePlanChange("PRO");
                  }}
                  className={`w-full mx-auto m-4 rounded-2xl shadow-lg p-2 text-white font-semibold 
    ${
      // Cancelled subscription → always allow (blue)
      subscription?.status === "canceled"
        ? "bg-navy_blue cursor-pointer"
        : subscription?.plan === SubscriptionPlan?.PRO &&
          subscription?.interval === interval
        ? "bg-soft_gray opacity-70 cursor-not-allowed"
        : subscription?.plan === SubscriptionPlan?.PRO &&
          subscription?.interval === "YEARLY" &&
          interval === "MONTHLY"
        ? "bg-soft_gray opacity-70 cursor-not-allowed"
        : "bg-navy_blue cursor-pointer"
    }
  `}
                >
                  {buttonLoading && clickedPlan === "PRO" ? (
                    <h1 className="text-center font-semibold">Processing...</h1>
                  ) : (
                    <h1 className="text-center font-semibold">
                      {subscription?.status === "canceled"
                        ? interval === "YEARLY"
                          ? "Subscribe to Pro Yearly"
                          : "Subscribe to Pro Monthly"
                        : subscription?.plan === SubscriptionPlan?.PRO &&
                          subscription.interval === interval
                        ? "You Already Have This Plan"
                        : subscription?.plan === SubscriptionPlan?.PRO &&
                          subscription?.interval === "YEARLY" &&
                          interval === "MONTHLY"
                        ? "Downgrade not allowed"
                        : interval === "YEARLY"
                        ? "Upgrade to Pro Yearly"
                        : "Upgrade to Pro Monthly"}
                    </h1>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Enterprise plan */}
          <div className="w-full p-[1px] rounded-2xl overflow-hidden relative  ">
            <div className="w-full  bg-card shadow-lg bg-[#FAFAFA] border-soft_gray border-[1px] rounded-2xl  py-5">
              <div className="w-[95%] xl:w-[80%] 2xl:w-[60%]  mx-auto h-full flex flex-col  gap-1  ">
                <h1 class="bg-black text-3xl tracking-wider text-center font-semibold inline-block text-transparent bg-clip-text">
                  Enterprise Plan
                </h1>
                <p className="text-sm font-light text-center ">
                  Tailored for multi-provider clinics, hospitals, and health
                  tech integrations.
                </p>
                <p className="text-lg font-light text-center text-pink mt-3 mb-2">
                  <span className="font-semibold">
                    Custom Pricing – Contact Us
                  </span>
                </p>

                <div className="flex flex-col  items-start gap-6  my-4 ">
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Everything from PRO Plan PLUS
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Custom workflow integration
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Dedicated support & onboarding
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Bulk licensing options
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      HIPAA and PIPEDA Compliance
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      SLA-backed uptime & compliance
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-4">
                    <FaHandPointRight className="text-navy_blue text-lg min-w-[20px]" />
                    <h1 className="font-light text-[15px]">
                      Optional API access for EHR integration
                    </h1>
                  </div>
                </div>

                <button
                  disabled={buttonLoading && clickedPlan === "ENTERPRISE"}
                  onClick={() => navigate("/contact")}
                  // onClick={() => toast.error("Need to contact for custom price")}
                  className={`w-full cursor-pointer mx-auto m-4 rounded-2xl shadow-lg p-2 ${
                    subscription?.plan === SubscriptionPlan?.ENTERPRISE
                      ? "bg-soft_gray text-white"
                      : "bg-navy_blue text-white"
                  }`}
                >
                  {buttonLoading && clickedPlan === "ENTERPRISE" ? (
                    <h1 className="text-center font-semibold">Processing...</h1>
                  ) : (
                    <h1 className="text-center font-semibold">
                      {/* {getPlanLabel(
                        subscription?.plan,
                        SubscriptionPlan?.ENTERPRISE
                      )} */}
                      Contact Us
                    </h1>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
