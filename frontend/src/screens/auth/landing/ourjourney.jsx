import Button from "../../../components/Button";
import { FaClipboardList } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
import Footer from "../../../components/landing/home/footer";
import { HiLink } from "react-icons/hi";
import { IoDocumentTextSharp } from "react-icons/io5";
import Navbar from "../../../components/landing/navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
const OurJourney = () => {
  const navigate = useNavigate();
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
            Our
          </h1>
          <h1 className="text-3xl font-bold tracking-wide text-black border-b-[4px] border-transparent">
            Journey
          </h1>
        </div>

        <p className="font-medium text-[15px] mx-2 md:mx-10 mt-4">
          At Vocalli AI, our story begins with a simple but profound
          realization: healthcare professionals deserve better tools to manage
          their documentation.
        </p>

        <div className="w-full flex flex-row items-center my-7 px-5 lg:px-10">
          <div className="hidden sm:block w-[40%] bg-red-500">
            <img
              src="/assets/journey/doctor.png"
              alt=""
              className="object-cover w-[400px] h-[400px]"
            />
          </div>
          <div className="w-full sm:w-[60%] h-full p-2 lg:p-4 flex flex-col  justify-center">
            <h1 className="text-2xl font-medium text-black mb-4">
              The Challenge
            </h1>

            <p className="text-gray text-sm  font-light pr-4 lg:pr-32">
              For years, healthcare providers have grappled with the
              inefficiencies of outdated EHR systems and transcription tools
              that consume valuable time. One of our founders, a dedicated pain
              management physician, faced these challenges firsthand. Day after
              day, they found themselves spending hours on tedious documentation
              tasks, using systems that felt clunky, expensive, and out of touch
              with the realities of modern clinical practice. The frustration
              grew. Documentation was taking time away from what truly
              mattered—caring for patients.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center  pb-4">
          <h1 className="text-2xl mt-5 text-center font-semibold tracking-wide">
            The Vision
          </h1>

          <p className="font-light text-gray text-[15px] mx-2 md:mx-10 my-3 text-center">
            Determined to create a better solution, our founder envisioned a
            tool that could:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-10 max-w-[1440px] mt-3 mx-2 sm:mx-5 ld:mx-[70px] xl:mx-[100px] ">
            {actions.map((action) => (
              <div
                key={action.id}
                className=" gap-3 bg-white w-full p-2 md:p-5 rounded-2xl flex flex-col mx-auto items-center justify-center shadow-xl"
              >
                <div className="w-[50px] h-[40px] bg-navy_blue rounded-lg flex items-center justify-center">
                  {action.Icon}
                </div>

                <p className=" text-[15px] font-medium text-center text-navy_blue">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center bg-navy_blue mt-10 mb-40 ">
          <div className="w-full sm:w-[40%] relative h-[400px]">
            <img
              src="/assets/journey/innovation.png"
              alt=""
              className="object-contain absolute h-[410px] w-[330px] -bottom-5 sm:-bottom-20 left-0"
            />
          </div>
          <div className="w-full sm:w-[60%] h-full my-10 sm:my-0 p-2">
            <h1 className="text-white text-2xl font-medium mb-2 tracking-wide">
              The Innovation
            </h1>
            <p className="text-white text-sm font-light pr-4 lg:pr-32">
              Combining personal insights with cutting-edge AI technology, Dr.
              Scribe was designed to be more than just a tool—it became a
              trusted partner in clinical documentation. Built with a deep
              understanding of the unique needs of healthcare professionals, Dr.
              Scribe:
            </p>

            <div className="flex flex-col gap-4 my-4">
              <div className="flex flex-row items-center gap-2 ">
                <div className="w-[35px] h-[35px] bg-[#224381] rounded-full flex items-center justify-center">
                  <h1 className="text-white text-lg font-medium">1</h1>
                </div>
                <p className="text-white text-sm font-light">
                  Listens and transcribes patient-provider conversations in real
                  time.
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 ">
                <div className="w-[35px] h-[35px] bg-[#224381] rounded-full flex items-center justify-center">
                  <h1 className="text-white text-lg font-medium">2</h1>
                </div>
                <p className="text-white text-sm font-light">
                  Organizes notes into structured, accurate formats.
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 ">
                <div className="w-[35px] h-[35px] bg-[#224381] rounded-full flex items-center justify-center">
                  <h1 className="text-white text-lg font-medium">3</h1>
                </div>
                <p className="text-white text-sm font-light">
                  Integrates effortlessly with any EHR system.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full items-center flex flex-col relative  my-3 overflow-hidden">
          <div className="w-[40px] h-[40px] bg-light_blue rounded-full absolute top-[25%] left-[10%]" />
          <div className="w-[150px] h-[150px] bg-light_blue rounded-full absolute top-[40%] -left-10" />
          <div className="w-[150px] h-[150px] bg-light_blue rounded-full absolute bottom-[5%] -right-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-2 sm:px-10">
            <div className="flex flex-col items-center relative ">
              <h1 className="text-2xl font-semibold tracking-wide text-black lg:absolute lg:-bottom-8 w-[300px] text-center">
                Driving Impact Through Commitment
              </h1>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-full flex bg-white bg-opacity-50 z-10 flex-col items-center justify-center border-gray border-[1px] rounded-tr-[50px] rounded-bl-[50px] p-2 sm:p-6">
                <h1 className="text-2xl font-semibold tracking-wide text-black my-4">
                  The Impact
                </h1>
                <p className="text-gray text-sm font-light text-center">
                  Since its launch, Vocalli AI has transformed how healthcare
                  professionals approach documentation. Thousands of providers
                  across the nation are now saving hours daily, improving
                  accuracy, and focusing more on patient care.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end  mt-5 lg:mt-10  sm:ml-32 p-2 sm:p-0 w-full sm:w-[80%] lg:w-[50%] z-10">
            <div className="w-full flex flex-col items-center justify-center bg-white bg-opacity-50 border-gray border-[1px] rounded-tr-[50px] rounded-bl-[50px] p-2 sm:p-6">
              <h1 className="text-2xl font-semibold tracking-wide text-black my-4">
                Our Commitment
              </h1>
              <p className="text-gray text-sm font-light text-center ">
                Our journey doesn’t end here. At Vocalli AI, we are constantly
                evolving, driven by the feedback and needs of the healthcare
                community. Our mission is to empower physicians and providers to
                reclaim their time, reduce administrative burdens, and deliver
                exceptional care. Vocalli AI is not just a product; it’s a
                movement to redefine what’s possible in healthcare
                documentation.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center bg-[#FAFAFA] mt-10 py-10 px-2">
          <h1 className="text-2xl font-semibold tracking-wide text-navy_blue">
            Join Us!
          </h1>
          <h2 className="text-[15px] font-semibold text-center my-4">
            Join us on this journey. Together, we can create a smarter, more
            efficient future for healthcare.
          </h2>
          <div className="flex w-[200px] items-center justify-center">
            <Button onClick={() => { navigate("/signup") }} label="Join Now" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurJourney;
