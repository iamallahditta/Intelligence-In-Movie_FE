import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

const reviews = [
  {
    name: "Dr. Anna Julie",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-K5Wy_yD_JlW5V6d6ApSHnn9W7G48kMcMug&s",
    rating: 5,
    text: "Vocalli AI has completely transformed my practice. I used to spend 2-3 hours on documentation after clinic hours. Now, everything is done automatically while I'm with the patient. The AI-generated summaries are remarkably accurate, and I can review and export reports in minutes. This tool has given me back my evenings and improved my work-life balance significantly.",
  },
  {
    name: "Dr. John Doe",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4,
    text: "As a busy physician seeing 30+ patients daily, Vocalli AI has been a game-changer. The real-time transcription is incredibly accurate, even with medical terminology. What I love most is how it organizes patient histories automatically. I can quickly access past visits and track treatment progress without digging through files. Highly recommended for any healthcare professional looking to streamline their workflow.",
  },
  {
    name: "Dr. William Chen",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 5,
    text: "I was skeptical about AI in healthcare, but Vocalli AI exceeded my expectations. The platform is intuitive, secure, and incredibly efficient. My patients appreciate that I can maintain eye contact during consultations instead of typing notes. The comprehensive SOAP notes generated save me at least 10 hours per week. This investment has paid for itself many times over.",
  },
];

const Testimonials = () => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});

  const CHARACTER_LIMIT = 200;

  const toggleReadMore = (index) => {
    setExpandedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div id='testimonials' className="max-w-[1440px] w-full  mx-auto">
      <div className="flex justify-center items-center">
        <h1 className="text-center mx-auto  text-3xl font-bold text-black tracking-wide border-b-[4px] border-navy_blue inline-block p-[4px]">
          Testimonials
        </h1>
      </div>

      <div className="flex flex-row items-center mx-2 lg:mx-5 xl:mx-10  mt-8 gap-4">
        <div
          className={`min-w-14 min-h-14 cursor-pointer flex duration-300 rounded-full bg-light_blue items-center justify-center 
            ${activeIndex === 0 ? "opacity-0" : "opacity-100"}
            `}
          onClick={() => {
            swiper?.slidePrev();
          }}
        >
          <FaArrowLeft className={`text-navy_blue duration-300 text-2xl `} />
        </div>

        <Swiper
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={(e) => {
            setActiveIndex(e.activeIndex);
          }}
          className="swiper1 "
        >
          {reviews.map((review, index) => {
            const isExpanded = expandedReviews[index];
            const shouldTruncate = review.text.length > CHARACTER_LIMIT;
            const displayText = isExpanded || !shouldTruncate 
              ? review.text 
              : `${review.text.slice(0, CHARACTER_LIMIT)}...`;

            return (
              <SwiperSlide key={index} className="bg-grose-500  w-full flex flex-col  ">
                <div className="relative border-[1px] border-navy_blue rounded-xl overflow-visible mt-20 mb-3 px-2 py-12  sm:px-5  sm:py-12 lg:py-16 lg:px-16  w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
                  <img
                    src={review.image}
                    className="max-w-32 w-32 h-32 max-h-32 rounded-full object-cover absolute top-0 left-[50%] -translate-x-[50%] -translate-y-[60%] z-[999]"
                  />
                  <div className="flex flex-col gap-1 ">
                    <h1 className="font-semibold text-center my-2">
                      {review.name}
                    </h1>
                    <p className="text-center font-light text-[#6E6E6E]">
                      {displayText}
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleReadMore(index)}
                          className="ml-2 text-navy_blue font-medium hover:underline"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div
          className={`cursor-pointer min-w-14 min-h-14 duration-300 rounded-full bg-light_blue flex items-center justify-center ${
            activeIndex === reviews.length - 1 ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            swiper?.slideNext();
          }}
        >
          <FaArrowRight className={`text-navy_blue duration-300 text-2xl `} />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
