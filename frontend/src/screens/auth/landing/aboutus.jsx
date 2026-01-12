import { BsCapsulePill } from "react-icons/bs";
import Button from "../../../components/Button";
import { FaBandAid } from "react-icons/fa";
import { FaBrain } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaHandPointRight } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";
import Footer from "../../../components/landing/home/footer";
import { GoGraph } from "react-icons/go";
import Navbar from "../../../components/landing/navbar";
import React from "react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "1",
    title: "Integrity",
    description:
      "Built by healthcare professionals for healthcare professionals",
    Icon: <FaHandHoldingHeart className="text-navy_blue text-3xl" />,
  },
  {
    id: "2",
    title: "Innovation",
    description: "Focused on enhancing workflows, not adding complexity.",
    Icon: <GoGraph className="text-navy_blue text-3xl" />,
  },
  {
    id: "3",
    title: "Empathy",
    description:
      "Committed to providing secure, efficient, and affordable solutions.",
    Icon: <FaBandAid className="text-navy_blue text-3xl" />,
  },
];

const solutions = [
  {
    id: "1",
    title: "Comprehensive Pain Assessment Templates",
    description:
      "Quickly document patient-reported pain levels, histories, and treatment plans.",
    Icon: <FaListOl className="text-navy_blue text-2xl" />,
  },
  {
    id: "2",
    title: "Procedure Documentation",
    description:
      "Streamlined templates for nerve blocks, epidurals, and ablations.",
    Icon: <FaBriefcaseMedical className="text-navy_blue text-2xl" />,
  },
  {
    id: "3",
    title: "Chronic Pain Tracking",
    description:
      "AI summaries for follow-up visits to monitor treatment effectiveness.",
    Icon: <FaBrain className="text-navy_blue text-2xl" />,
  },
  {
    id: "4",
    title: "Medication Management",
    description: "Track and document prescriptions seamlessly.",
    Icon: <BsCapsulePill className="text-navy_blue text-2xl" />,
  },
];

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div
        style={{ backgroundImage: `url('/assets/about/banner.svg')` }}
        className="max-w-[1440px] flex flex-col justify-center w-full h-[400px] md:h-[300px]  mx-auto relative"
      >
        <div className="w-[90%] sm:w-[80%]   mx-auto  flex">
          <div className="flex flex-col justify-start items-center  mr-auto">
            <h1 className="text-white text-3xl font-semibold mb-3 tracking-wide">
              About Us
            </h1>
            <p className="text-white font-medium text-sm">
              Compassion. Expertise. Innovation.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] w-full  mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-2 sm:mx-5 md:mx-10 lg:mx-20 my-10  ">
          <div className="w-full flex justify-center items-center  ">
            <img
              src="/assets/about/about.svg"
              alt=""
              className="w-[400px] h-[400px]"
            />
          </div>
          <div className="w-full h-full  p-4 flex flex-col  justify-center">
            <h1 className="text-2xl font-medium text-black mb-4">Our Vision</h1>

            <p className="text-gray text-sm  font-light">
              At Vocalli AI, we believe healthcare professionals deserve tools
              that work as hard as they do. Our mission is to empower physicians
              and healthcare teams to reclaim their time, reduce administrative
              burdens, and improve patient care through innovative technology.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-2 sm:mx-5 md:mx-10 lg:mx-20 my-10  ">
          <div className="w-full h-full  p-4 flex flex-col  justify-center">
            <h1 className="text-2xl font-medium text-black mb-4">Our Story</h1>

            <p className="text-gray text-sm  font-light">
              Vocalli AI was founded by a pain management physician frustrated
              with outdated documentation tools that consumed valuable time.
              Determined to create a better solution, we combined personal
              insights with cutting-edge AI to design a scribe that listens,
              learns, and works seamlessly in real time.
            </p>
          </div>

          <div className="w-full flex justify-center items-center  ">
            <img
              src="/assets/about/story.svg"
              alt=""
              className="w-[400px] h-[400px]"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center bg-light_blue pb-7">
          <h1 className="text-2xl my-5 text-center font-semibold tracking-wide">
            Why Choose Vocalli AI?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-10 lg:gap-20 max-w-[1440px] mx-2 sm:mx-5 ld:mx-[70px] xl:mx-[100px] ">
            {actions.map((action) => (
              <div
                key={action.id}
                className=" gap-3 bg-[#FAFAFA] w-full p-2 md:p-5 rounded-2xl flex flex-col mx-auto items-center justify-center shadow-lg"
              >
                {action.Icon}

                <p className=" text-[15px] font-medium text-center">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-2 sm:p-5 lg:p-10 ">
          <div className="col-span-1 sm:col-span-2 w-full flex flex-col gap-2 p-1 sm:p-5">
            <h1 className="text-2xl font-semibold text-black mb-4">
              Custom Solutions for Pain Management Specialists
            </h1>

            <p className=" text-sm  font-light">
              Vocalli AI understands the intricacies of managing chronic and
              acute pain. Our platform is designed to simplify the documentation
              process for pain management professionals while ensuring accuracy
              and compliance.
            </p>
          </div>

          {solutions.map((action) => (
            <div
              key={action.id}
              className=" gap-3 bg-navy_blue w-full p-3 md:p-5 rounded-2xl flex flex-col mx-auto  justify-center shadow-lg"
            >
              <div className="bg-white w-12 h-12  rounded-full  mr-auto flex items-center justify-center">
                {action.Icon}
              </div>
              <p className=" text-sm font-medium text-white ">{action.title}</p>
              <p className=" text-sm text-white font-light">
                {action.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col sm:flex-row py-10 px-5 lg:px-20">
          <div className="sm:w-[60%] w-full flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-wide">
              Why Pain Management Specialists Love Vocalli AI
            </h1>
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-row gap-3">
                <FaHandPointRight className="text-navy_blue text-xl" />
                <p className="text-[15px] font-light">
                  Save time documenting complex histories and procedures.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <FaHandPointRight className="text-navy_blue text-xl" />
                <p className="text-[15px] font-light">
                  Ensure compliance with state and federal regulations.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <FaHandPointRight className="text-navy_blue text-xl" />
                <p className="text-[15px] font-light">
                  Gain accurate, categorized documentation ready for EMR upload.
                </p>
              </div>
            </div>

            <div className="mt-5 w-[300px]">
              <Button onClick={() => { navigate("/our_journey") }} label="Learn More About Our Journey" outline={true} />
            </div>
          </div>
          <div className="sm:w-[40%] w-full mt-5 sm:mt-0 ">
            <img
              src="/assets/about/girl.svg"
              className="object-contan w-[320px] h-[320px]"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
