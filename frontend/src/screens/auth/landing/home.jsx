import React, { useEffect } from 'react'

import AboutUs from '../../../components/landing/home/aboutUs'
import Banner from '../../../components/landing/home/banner'
import Benefits from '../../../components/landing/home/benefits'
import Footer from '../../../components/landing/home/footer'
import HowItWorks from '../../../components/landing/home/howItWorks'
import Navbar from '../../../components/landing/navbar'
import Testimonials from '../../../components/landing/home/testimonials'

const Home = () => {
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
      <HowItWorks />
      <AboutUs />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
