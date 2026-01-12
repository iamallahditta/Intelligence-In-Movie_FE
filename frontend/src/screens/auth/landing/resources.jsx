import { BiSolidPhoneCall } from "react-icons/bi";
import { BsQuote } from "react-icons/bs";
import Button from "../../../components/Button";
import { FaClipboardList } from "react-icons/fa";
import { FaElementor } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Footer from "../../../components/landing/home/footer";
import { HiBuildingOffice } from "react-icons/hi2";
import { HiLink } from "react-icons/hi";
import { ImClock2 } from "react-icons/im";
import { IoDocumentTextSharp } from "react-icons/io5";
import { IoIosChatboxes } from "react-icons/io";
import { LuMessagesSquare } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import Navbar from "../../../components/landing/navbar";

const actions = [
  {
    id: "1",
    title: "Integrity",
    description: "Save hours of administrative time daily",
    Icon: <IoDocumentTextSharp className="text-white text-2xl" />,
  },
  {
    id: "2",
    title: "Innovation",
    description: "Affordable, flexible pricing with no hidden fees.",
    Icon: <FaMicrophoneAlt className="text-white text-2xl" />,
  },
  {
    id: "3",
    title: "Empathy",
    description: "Risk-free trial and satisfaction guaranteed",
    Icon: <HiLink className="text-white text-2xl" />,
  },
  {
    id: "4",
    title: "Empathy",
    description: "Risk-free trial and satisfaction guaranteed",
    Icon: <FaClipboardList className="text-white text-2xl" />,
  },
];

const caseStudies = [
  {
    id: 1,
    title: "Primary Care Success Story",
    description:
      "How a busy family practice reduced documentation time by 45% using Vocalli AI",
    image: "/assets/resources/case-study-1.png",
  },
  {
    id: 2,
    title: "Specialist Implementation",
    description:
      "Cardiology clinic improves patient satisfaction with streamlined documentation",
    image: "/assets/resources/case-study-2.png",
  },
  {
    id: 3,
    title: "Multi-Provider Practice",
    description:
      "Group practice saves 2 hours per provider daily with automated documentation",
    image: "/assets/resources/case-study-3.png",
  },
];

const Resources = () => {
  return (
    <div>
      <Navbar />

      <div className="max-w-[1440px] mx-auto flex flex-col">
        <div className="flex flex-row items-center mx-2 md:mx-10 mt-10">
          <h1 className="text-3xl font-bold text-black border-b-[4px] w-[70px] text-right border-navy_blue">
            Res
          </h1>
          <h1 className="text-3xl font-bold tracking-wide text-black border-b-[4px] border-transparent">
            ources
          </h1>
        </div>

        <h1 className="text-xl tracking-wider font-bold text-black mx-2 md:mx-10 mt-10">
          Unlock the Full Potential of Vocalli AI
        </h1>

        <p className="font-medium text-[15px] mx-2 md:mx-10 mt-4">
          Explore our library of resources to help you maximize efficiency and
          streamline your workflow.
        </p>

        <div className="flex flex-col items-center gap-2 my-20 relative">
          <img
            src="/assets/resources/left.svg"
            className="absolute top-10 left-0"
          />
          <img
            src="/assets/resources/right.svg"
            className="absolute bottom-10 right-0"
          />
          <h1 className="text-2xl font-bold text-black tracking-wider">
            Getting Started Guide
          </h1>
          <p className="font-medium text-[15px]">
            A step-by-step tutorial to set up and use Vocalli AI.
          </p>

          <div className="flex flex-col w-full z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="hidden sm:flex flex-col items-end gap-2 w-full  px-5 py-8 border-r-[2px] border-soft_gray">
                <IoIosChatboxes className="text-light_blue text-2xl" />
                <FaMicrophoneAlt className="text-navy_blue text-3xl" />
              </div>
              <div className="flex flex-col p-5 ">
                <div className="flex flex-row items-center justify-center w-10 h-10 bg-navy_blue rounded-full gap-2">
                  <h1 className="text-white text-sm">1</h1>
                </div>
                <h1 className="text-sm font-semibold text-black my-2">
                  Listens and transcribes patient
                </h1>
                <p className="font-light text-sm">
                  Dr.Scribe listens to patient-provider conversations to help
                  document clinical information accurately and efficiently.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col items-start sm:items-end p-5 border-0 sm:border-r-[2px] border-soft_gray">
                <div className="flex flex-row items-center justify-center w-10 h-10 bg-navy_blue rounded-full gap-2">
                  <h1 className="text-white text-sm">2</h1>
                </div>
                <h1 className="text-sm font-semibold text-black my-2">
                  Generates a dialogue flow
                </h1>
                <p className="font-light text-sm ml-0 sm:ml-[20px] lg:ml-[100px] xl:ml-[200px]">
                  Vocalli AI uses AI and voice recognition technology to create
                  a transcript of the dialogue flow between providers and
                  patients.{" "}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-start gap-2 w-full  px-5 py-8 ">
                <IoIosChatboxes className="text-light_blue text-2xl opacity-0" />
                <FaUserGroup className="text-navy_blue text-3xl" />
              </div>
            </div>

            {/* 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="hidden sm:flex flex-col items-end gap-2 w-full  px-5 py-8 border-r-[2px] border-soft_gray">
                <IoIosChatboxes className="text-light_blue text-2xl opacity-0" />
                <IoDocumentTextSharp className="text-navy_blue text-3xl" />
              </div>
              <div className="flex flex-col p-5 ">
                <div className="flex flex-row items-center justify-center w-10 h-10 bg-navy_blue rounded-full gap-2">
                  <h1 className="text-white text-sm">3</h1>
                </div>
                <h1 className="text-sm font-semibold text-black my-2">
                  Creates a clinical document draft{" "}
                </h1>
                <p className="font-light text-sm">
                  Dr.Scribe categorizes the summarized content into appropriate
                  Progress Note sections and allows for reviewing and importing
                  relevant data for clinical documentation.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col items-start sm:items-end p-5 border-0 sm:border-r-[2px] border-soft_gray">
                <div className="flex flex-row items-center justify-center w-10 h-10 bg-navy_blue rounded-full gap-2">
                  <h1 className="text-white text-sm">4</h1>
                </div>
                <h1 className="text-sm font-semibold text-black my-2">
                  Assists with order entry
                </h1>
                <p className="font-light text-sm ml-0 sm:ml-[20px] lg:ml-[100px] xl:ml-[200px]">
                  Vocalli AI draft captures labs, imaging, procedures,
                  medication orders, and follow-up visit details.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-start gap-2 w-full  px-5 py-8 ">
                <IoIosChatboxes className="text-light_blue text-2xl opacity-0" />
                <FaElementor className="text-navy_blue text-3xl" />
              </div>
            </div>

            {/* 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="hidden sm:flex flex-col items-end gap-2 w-full  px-5 py-8 border-r-[2px] border-soft_gray">
                <IoIosChatboxes className="text-light_blue text-2xl opacity-0" />
                <FaRegStarHalfStroke className="text-navy_blue text-3xl" />
              </div>
              <div className="flex flex-col p-5 ">
                <div className="flex flex-row items-center justify-center w-10 h-10 bg-navy_blue rounded-full gap-2">
                  <h1 className="text-white text-sm">5</h1>
                </div>
                <h1 className="text-sm font-semibold text-black my-2">
                  Provides a summary for review{" "}
                </h1>
                <p className="font-light text-sm">
                  Dr.Scribe streamlines the clinical documentation process by
                  allowing healthcare providers to review summarized content for
                  accuracy, modify it if necessary, and merge pre-configured
                  defaults with a single click.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 my-10 mx-2 sm:mx-7">
          <h1 className="text-2xl font-bold text-black tracking-wider">
            Case Studies
          </h1>
          <p className="font-medium text-[15px]">
            Learn how healthcare professionals like you save time with Vocalli
            AI.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-7">
            {caseStudies.map((item) => (
              <div className="flex flex-col gap-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <h1 className="text-sm font-semibold text-center text-black">
                  {item.title}
                </h1>
              </div>
            ))}
          </div>

          {/* <div className="w-[150px] mx-auto mt-7">
            <Button label="Read more" />
          </div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
