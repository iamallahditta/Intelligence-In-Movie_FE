import { BiSolidPhoneCall } from "react-icons/bi";
import { BsQuote } from "react-icons/bs";
import Button from "../../../components/Button";
import { FaClipboardList } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Footer from "../../../components/landing/home/footer";
import { HiBuildingOffice } from "react-icons/hi2";
import { HiLink } from "react-icons/hi";
import { ImClock2 } from "react-icons/im";
import { IoDocumentTextSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import Navbar from "../../../components/landing/navbar";
import { useEffect } from "react";

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
const Contact = () => {
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

      <div className="max-w-[1440px] mx-auto flex flex-col">
        <div className="flex flex-row items-center mx-2 md:mx-10 mt-10">
          <h1 className="text-3xl font-bold text-black border-b-[4px] w-[70px] text-right border-navy_blue">
            Con
          </h1>
          <h1 className="text-3xl font-bold tracking-wide text-black border-b-[4px] border-transparent">
            tact Us
          </h1>
        </div>

        <p className="font-medium text-[15px] mx-2 md:mx-10 mt-4">
          We’re here to assist you! Vocalli AI provides comprehensive support
          through our chat and ticketing systems, ensuring your questions are
          answered quickly and effectively.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 w-full my-10 px-2">
          <div className="flex flex-col gap-10 items-center justify-center relative  mb-5 sm:mb-0 p-2 xl:px-14">
            <div className="flex flex-row gap-3 bg-[#FAFAFA] rounded-xl p-4 shadow-sm">
              <div className="flex flex-row items-center justify-center min-w-12 max-h-12 bg-navy_blue rounded-full">
                <MdEmail className="text-white text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-black font-medium">Live Chat Support</h1>
                <p className="text-black font-light">
                  Get instant help from our team via live chat, available
                  directly on our website. Our chat support operates 24x7x365 to
                  address your queries in real time.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-3 bg-[#FAFAFA] rounded-xl p-4 shadow-sm">
              <div className="flex flex-row items-center justify-center min-w-12 max-h-12 bg-navy_blue rounded-full">
                <MdEmail className="text-white text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-black font-medium">Live Chat Support</h1>
                <p className="text-black font-light">
                  Get instant help from our team via live chat, available
                  directly on our website. Our chat support operates 24x7x365 to
                  address your queries in real time.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center relative h-[500px]">
            <div className="absolute w-[92%]  lg:w-[85%] xl:w-[75%] h-[400px] bg-light_blue shadow-md flex flex-col justify-center gap-7 px-10">
              <div className="absolute top-0 left-0 -translate-x-[40%] -translate-y-[40%] shadow-md w-12 h-12 bg-navy_blue" />
              <h1 className="text-xl text-navy_blue font-medium tracking-wide">
                Get in Touch
              </h1>

              <div className="flex flex-col gap-7">
                <div className="flex flex-row items-center gap-2">
                  <MdEmail className="text-navy_blue text-lg mt-[2px]" />
                  <h1 className="text-black font-medium">
                    support@vocalli.ai
                  </h1>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <BiSolidPhoneCall className="text-navy_blue text-lg mt-[2px]" />
                  <h1 className="text-black font-medium">
                    +1-800-555-DRSCRIBE
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <HiBuildingOffice className="text-navy_blue text-lg mt-[2px]" />
                  <h1 className="text-black font-medium">
                    456 HealthTech Blvd, MedCity, USA
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <ImClock2 className="text-navy_blue text-lg mt-[2px]" />
                  <h1 className="text-black font-medium">9:00 AM - 8:00 PM</h1>
                </div>
              </div>
            </div>
            <div className="h-full w-[200px] bg-navy_blue ml-auto  flex flex-col">
              <div className="flex flex-row items-center justify-center w-full p-3 gap-5 mt-auto">
                <FaFacebookF className="text-white cursor-pointer text-xl" />
                <FaTwitter className="text-white cursor-pointer text-xl" />
                <FaLinkedinIn className="text-white cursor-pointer text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-2 lg:p-10">
          <h1 className="font-semibold ">
            Want to explore how Vocalli AI can transform your practice?
            <br /> Schedule a personalized demo with our experts.
          </h1>

          <div className="w-[150px] my-3">
            <Button label="Book a Demo" />
          </div>
          <div className="flex flex-row items-center gap-2 ">
            <div className="relative min-w-[12px] h-[20px] ">
              <BsQuote className="text-navy_blue text-xl absolute -top-10 sm:-top-4 left-0" />
            </div>
            <h1 className="text-black font-light">
              Vocalli AI is dedicated to providing the support you need to
              simplify your workflows and focus on patient care. Start a chat or
              submit a ticket today—we’re here for you!
            </h1>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
