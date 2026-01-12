import React, { useEffect } from 'react'

import Banner from '../../../components/landing/howItWorks/banner';
import Footer from '../../../components/landing/home/footer'
import Navbar from '../../../components/landing/navbar'

const HowItWorks = () => {
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
    <Banner />
      <Footer />
    </div>
  )
}

export default HowItWorks
