import React, { useEffect } from "react";

import Banner from "../../../components/landing/howItWorks/banner";
import Button from "../../../components/Button";
import { FaDollarSign } from "react-icons/fa";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { FaHandPointRight } from "react-icons/fa";
import { FaRocket } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import Footer from "../../../components/landing/home/footer";
import { HiClock } from "react-icons/hi2";
import { IoIosHand } from "react-icons/io";
import { MdDone } from "react-icons/md";
import Navbar from "../../../components/landing/navbar";

const actions = [
  {
    id: "1",
    title: "Integrity",
    description: "Save hours of administrative time daily",
    Icon: <HiClock className="text-navy_blue text-3xl" />,
  },
  {
    id: "2",
    title: "Innovation",
    description: "Affordable, flexible pricing with no hidden fees.",
    Icon: <FaDollarSign className="text-navy_blue text-3xl" />,
  },
  {
    id: "3",
    title: "Empathy",
    description: "Risk-free trial and satisfaction guaranteed",
    Icon: <FaShieldAlt className="text-navy_blue text-3xl" />,
  },
];
const Pricing = () => {
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
      <Navbar />

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
                  <p className="text-lg font-light text-center text-pink mt-3 mb-2">
                    <span className="font-semibold">$0 /month</span>
                  </p>

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
                    Best for independent physicians and clinics needing
                    unlimited access.
                  </p>
                  <p className="text-lg font-light text-center text-pink mt-3 mb-2">
                    <span className="font-semibold">$79 /month</span>
                  </p>

                 

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
                    <h1 className="font-light text-[15px]">
                     Cancel anytime
                    </h1>
                  </div>
                </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
