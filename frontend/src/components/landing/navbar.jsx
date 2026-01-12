import { IoClose, IoMenu } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Button from "../Button";
import useCurrentHash from "../../hooks/useCurrentHash";

const Navbar = () => {
  const { currentHash, setCurrentHash } = useCurrentHash();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "How it works",
      href: "/how_it_works",
    },
    {
      label: "FAQ's",
      href: "/faqs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About Us",
      href: "/aboutus",
    },
    {
      label: "Our Journey",
      href: "/our_journey",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
    {
      label: "Resources",
      href: "/resources",
    },
  ];
  return (
    <nav
      className={`flex justify-center w-full items-center sticky top-0 z-[100] bg-[#FAFAFA] shadow-sm h-[70px] ${
        !isMobileMenuOpen ? "overflow-hidden" : ""
      }`}
    >
      <div className="max-w-[1440px] w-full flex flex-row items-center justify-between h-full ">
        <img
          src="/vocalli-logo.png"
          alt="vocalli-logo"
          className="w-44 h-auto"
        />
        <div className="hidden lg:flex flex-row items-center justify-center gap-3  h-[68px] ">
          {navItems.map((item, index) => (
            <Link
              to={item.href}
              key={index}
              className={`font-semibold duration-300 ${
                pathname === item.href
                  ? "border-b-navy_blue text-navy_blue"
                  : "border-b-transparent text-gray"
              } px-2 border-b-[2px] border-t-transparent h-full flex items-center justify-center`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <IoMenu
          onClick={() => {
            setIsMobileMenuOpen(true);
          }}
          className="text-navy_blue text-2xl m-4 cursor-pointer lg:hidden"
        />
        <div className=" flex-row items-center justify-center gap-4 m-3 hidden lg:flex">
          <Link to="/login" className="text-navy_blue font-semibold">
            Log In
          </Link>
          <div className="w-[100px]">
            <Button
              onClick={() => {
                navigate("/signup");
              }}
              label="Sign Up"
            />
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`flex lg:hidden h-screen bg-[#FAFAFA] fixed top-0 right-0 w-full duration-300 z-50 ${
          isMobileMenuOpen ? "max-w-72" : "max-w-0"
        } `}
      >
        <div className="flex flex-col   gap-6  w-full h-full">
          <IoClose
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
            className="text-navy_blue  m-4 cursor-pointer text-3xl"
          />
          {navItems.map((item, index) => (
            <Link
              onClick={() => {
                setCurrentHash(item.href);
                setIsMobileMenuOpen(false);
              }}
              key={index}
              to={item.href}
              className={`font-semibold duration-300 ${
                currentHash === item.href ? " text-navy_blue" : " text-gray"
              } px-4      flex items-center `}
            >
              {item.label}
            </Link>
          ))}

          <div className=" flex-row items-center  gap-4 m-3 flex">
            <Link to="/login" className="text-navy_blue font-semibold">
              Log In
            </Link>
            <div className="w-[100px]">
              <Button
                onClick={() => {
                  navigate("/signup");
                }}
                label="Sign Up"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
