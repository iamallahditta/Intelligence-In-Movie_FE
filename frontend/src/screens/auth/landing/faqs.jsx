import FaqItem from "../../../components/landing/faqs/faqItem";
import Footer from "../../../components/landing/home/footer";
import Navbar from "../../../components/landing/navbar";
import React from "react";

const Faqs = () => {
  const faqData = [
    {
      question: "What is Vocalli AI?",
      answer:
        "Vocalli AI is an AI-powered medical scribe that simplifies clinical documentation by transcribing and organizing patient-provider conversations in real time.",
    },
    {
      question: "Is Vocalli AI compatible with my EHR?",
      answer:
        "Yes, Vocalli AI is designed to integrate seamlessly with most major Electronic Health Record systems.",
    },
    {
      question: "How secure is my data with Vocalli AI?",
      answer:
        "We maintain the highest standards of security and compliance, ensuring all patient data is encrypted and handled in accordance with HIPAA regulations.",
    },
    {
      question: "What devices can I use Vocalli AI on?",
      answer:
        "Vocalli AI is compatible with most modern devices including desktop computers, laptops, tablets, and smartphones.",
    },
    {
      question: "Do I need special hardware to use Vocalli AI?",
      answer:
        "No special hardware is required. Vocalli AI works with your device's built-in microphone or any standard external microphone.",
    },
    {
      question: "Can I try Vocalli AI before committing?",
      answer:
        "Yes, we offer a free trial period so you can experience the benefits of Vocalli AI firsthand before making a commitment.",
    },
  ];

  return (
    <div>
      <Navbar />
      <div
        className={`max-w-[1440px] flex-col w-full  mx-auto my-14 px-2 md:px-5 lg:px-10`}
      >
        <div className="flex flex-row items-center ">
          <h1 className="text-3xl font-bold text-black border-b-[4px] w-[85px] text-right border-navy_blue">
            FAQ
          </h1>
          <h1 className="text-3xl font-bold text-black border-b-[4px] border-transparent">
            's
          </h1>
        </div>
        <div className="flex flex-col mx-auto w-[95%] sm:w-[90%] lg:w-[80%] my-3">
          {faqData.map((item, index) => (
            <FaqItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;
