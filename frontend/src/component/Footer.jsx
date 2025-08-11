import React from "react";
import logo from "../assets/BrandLogo.png";
function Footer() {
  return (
    <div className="w-full md:h-[36vh] min-h-[25vh] mb-[90px] md:mb-0">
      <div className="w-full md:h-[30vh] min-h-[15vh] bg-white flex flex-col md:flex-row items-center md:items-start justify-center md:px-[50px] px-2 py-4 gap-6 md:gap-4">
        <div className="w-full md:w-[30%] flex items-center md:items-start justify-center md:justify-start flex-col gap-1 md:gap-3 mb-2 md:mb-0">
          <div className="flex items-center gap-2 mt-2 md:mt-10">
            <img
              src={logo}
              alt=""
              className="md:w-[40px] md:h-[40px] w-[30px] h-[30px]"
            />
            <p className="text-[19px] md:text-[20px] text-[black] ">
              UrbanWagon
            </p>
          </div>
          <p className="text-[14px] md:text-[15px] text-[#1e2223] hidden md:block">
            UrbanWagon is your all-in-one online shopping destination, offering
            top-quality products, unbeatable deals, and fast delivery—all backed
            by trusted service designed to make your life easier every day.
          </p>
          <p className="text-[14px] md:text-[15px] text-[#1e2223] flex md:hidden text-center">
            Fast. Easy. Reliable. UrbanWagon Shopping
          </p>
        </div>
        <div className="w-full md:w-[25%] flex items-center justify-center flex-col text-center mb-2 md:mb-0">
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-10">
            <p className="text-[18px] md:text-[20px] text-[#1e2223] font-sans ">
              COMPANY
            </p>
          </div>
          <ul className="flex flex-col gap-1 mt-1">
            <li className="text-[15px] text-[#1e2223] hidden md:block cursor-pointer">
              Home
            </li>
            <li className="text-[15px] text-[#1e2223] cursor-pointer ">
              About us
            </li>
            <li className="text-[15px] text-[#1e2223] hidden md:block cursor-pointer">
              Delivery
            </li>
            <li className="text-[15px] text-[#1e2223] cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>
        <div className="w-full md:w-[25%] flex items-center justify-center flex-col text-center">
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-10">
            <p className="text-[18px] md:text-[20px] text-[#1e2223] font-sans ">
              GET IN TOUCH
            </p>
          </div>
          <ul className="flex flex-col gap-1 mt-1">
            <li className="text-[15px] text-[#1e2223] ">+91-9876543210</li>
            <li className="text-[15px] text-[#1e2223] ">
              contact@urbanwagon.com
            </li>
            <li className="text-[15px] text-[#1e2223] hidden md:block">
              +1-123-456-7890
            </li>
            <li className="text-[15px] text-[#1e2223] hidden md:block">
              admin@urbanwagon.com
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full h-[1px] bg-slate-400"></div>
        <div className="w-full h-[5vh] bg-white flex items-center justify-center text-[13px] md:text-[15px]">
        Copyright 2025@UrbanWagon.com-All Rights Reserved
      </div>
    </div>
  );
}

export default Footer;
