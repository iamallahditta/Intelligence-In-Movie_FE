import Button from "../../Button";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
const actions = [
  {
    id: "1",
    title: "Integrity",
    description: "We uphold the highest standards.",
    Icon: <FaShieldAlt className="text-navy_blue text-3xl" />,
  },
  {
    id: "2",
    title: "Innovation",
    description: "We foster creativity to drive meaningful change.",
    Icon: <FaRocket className="text-navy_blue text-3xl" />,
  },
  {
    id: "3",
    title: "Empathy",
    description: "We deeply understand and prioritize user needs.",
    Icon: <FaHandHoldingHeart className="text-navy_blue text-3xl" />,
  },
];
const team = [
  {
    id: "1",
    title: "Brett Streich",
    description: "Lead Infrastructure Engineer",
    image: "/assets/team/team1.svg",
  },
  {
    id: "2",
    title: "Jamie Predovic",
    description: "Central Configuration Specialist",
    image: "/assets/team/team2.svg",
  },
  {
    id: "3",
    title: "Leon Stokes",
    description: "Forward Group Manager",
    image: "/assets/team/team3.svg",
  },
];
const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div id="about" className="max-w-[1440px] w-full  mx-auto">
      <div className="flex justify-center items-center">
        <h1 className="text-center mx-auto  text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          About Us
        </h1>
      </div>
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
          <div className="w-[150px] mt-5">
            <Button onClick={() => { navigate("/aboutus") }} label={"View Details"} small={true} />
          </div>
        </div>
      </div>
      <h1 className="text-3xl my-5 text-center font-semibold tracking-wide">
        Our Values
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-10 lg:gap-20 max-w-[1440px] mx-2 sm:mx-5 xl:mx-10 ">
        {actions.map((action) => (
          <div
            key={action.id}
            className=" gap-3 bg-light_blue w-full p-2 md:p-5 rounded-lg flex flex-col mx-auto items-center justify-center"
          >
            {action.Icon}

            <h1 className="text-2xl tracking-wide text-navy_blue font-medium">
              {action.title}
            </h1>
            <p className="text-navy_blue text-sm font-light text-center">
              {action.description}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mx-2 sm:mx-5 xl:mx-10 my-10">
        <div className="w-full  flex flex-col gap-3 lg:gap-6 justify-center">
          <h1 className="text-2xl font-medium ">Meet Our Team</h1>
          <p className="text-gray text-sm font-light">
            Our dedicated team of healthcare professionals, AI engineers, and software developers work together to create innovative solutions that transform medical documentation. We're passionate about making healthcare more efficient and improving patient outcomes.
          </p>
          <div className="w-[140px]">
            <Button
              onClick={() => {
                // navigate("/signup");
              }}
              label="Learn More"
            />
          </div>
        </div>
        {team.map((team) => (
          <div
            key={team.id}
            className="w-full  relative flex flex-col gap-6  justify-center"
          >
            <img
              src={team.image}
              alt=""
              className="w-full h-[400px] object-cover "
            />
            <div className="absolute bottom-10 left-0 p-2  w-full  bg-navy_blue  bg-opacity-70 flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-white text-center">
                {team.title}
              </h1>
              <p className="text-white text-sm font-light text-center">
                {team.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
