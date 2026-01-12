import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { FaHandPointRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/auth/useUser";
import useToken from "../../hooks/auth/useToken";

const PreSubscription = () => {
  const { token } = useToken();
  const [interval, setInterval] = useState("MONTHLY");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [freePlanLoading, setFreePlanLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleToggle = () => {
    setInterval(interval === "MONTHLY" ? "YEARLY" : "MONTHLY");
  };

  const [showNote, setShowNote] = useState(true);
  const monthlyPrice = 79;
  const yearlyPrice = 69 * 12;
  const savedAmount = monthlyPrice * 12 - yearlyPrice;

  const handleSubscribe = async (plan) => {
    if (plan === "BASIC") {
      setFreePlanLoading(true);
      try {
        await axios.post(
          "/v1/api/free",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("You’ve successfully subscribed to the Free plan!");

        const response = await axios.get("/v1/api/auth/me");
        setUser(response.data.user);
        navigate("/");
      } catch (err) {
        console.error("Free Plan Error:", err.response?.data || err.message);
        toast.error(
          err.response?.data?.error ||
            "Unable to activate the Free plan. Please try again."
        );
      } finally {
        setFreePlanLoading(false);
      }
    } else {
      setIsSubscribing(true);
      try {
        const res = await axios.post("/v1/api/create-checkout-session", {
          plan,
          token,
          interval,
        });

        toast.success("Redirecting to checkout...");
        window.location.href = res.data.url;
      } catch (err) {
        console.error("Subscription error:", err.response?.data || err.message);
        toast.error(
          err.response?.data?.error ||
            "Failed to initiate subscription. Please try again."
        );
      } finally {
        setIsSubscribing(false);
      }
    }
  };

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
  return (
    <div>
      <div className="max-w-[1440px] mx-auto flex flex-col">
        <div className="flex flex-row items-center justify-center mx-2 md:mx-10 mt-6">
          <h1 className="text-3xl font-bold tracking-wide text-black border-b-[4px] border-transparent">
            Pricing Plans
          </h1>
        </div>

        <p className="font-light text-[15px] mx-2 md:mx-10 mt-4 text-center">
          Choose best pricing plan for you
        </p>

        {showNote && (
          <div className="flex items-center justify-center mt-4 ">
            <div className="relative max-w-fit pr-10  bg-blue-100 text-blue-800 border border-blue-300 px-4 py-3 rounded-md mb-4">
              Subscription required. Start your free trial or upgrade your plan.
              <button
                onClick={() => setShowNote(false)}
                className="absolute top-2 right-3 text-blue-800 hover:text-blue-600 text-lg"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 lg:px-10 my-10 ">
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

                {/* <p className="text-sm font-light text-center text-text_gray">
                  Ends on {moment().format("MMMM DD, YYYY")}
                </p> */}
                <button
                  onClick={() => handleSubscribe("BASIC")}
                  disabled={freePlanLoading}
                  className="w-full cursor-pointer mx-auto m-4 bg-navy_blue text-white rounded-2xl shadow-lg p-2"
                >
                  <h1 className="text-center font-semibold">
                    {freePlanLoading ? "Activating..." : "Try now"}
                  </h1>
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
                  onClick={() => handleSubscribe("PRO")}
                  disabled={isSubscribing}
                  className="w-full cursor-pointer mx-auto m-4 bg-navy_blue text-white rounded-2xl shadow-lg p-2"
                >
                  <h1 className="text-center font-semibold">
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </h1>
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
                <div
                  // onClick={() => handleSubscribe("ENTERPRISE")}
                  onClick={() =>
                    // toast.error("Need to contact for custom price")
                    navigate("/contact")
                  }
                  className="w-full cursor-pointer mx-auto m-4 bg-navy_blue text-white rounded-2xl shadow-lg p-2"
                >
                  <h1 className="text-center font-semibold">Contact</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSubscription;
