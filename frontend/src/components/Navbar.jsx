import React from "react";
import "../assets/Navbar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser , faHouseFloodWater } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <>
    <nav className="w-full border-b border-gray-200 bg-[#e6fff9] fixed">
      <div className="mx-auto flex px-7 items-center justify-between  py-3">
        <span href="#" className="text-2xl font-black tracking-tight text-gray-900 flex gap-2 items-center justify-center">
          <FontAwesomeIcon icon={faHouseFloodWater} className="text-[#046e66] text-4xl"/>
          <p className="[word-spacing:3px]">RAKSHA<span className="text-[#038161] text-2xl"> SETU</span></p>
        </span>

        <div className="hidden items-center mr-37 gap-10 md:flex">
          <a href="#" className="text-[16px] py-1 px-2 font-bold text-[#025742] hover:a">
            Home
          </a>
          <a
            href="#"
            className="text-[16px] font-bold py-1 px-2 text-gray-600 transition hover:text-gray-900"
          >
            About
          </a>
          <a
            href="#"
            className="text-[16px] font-bold py-1 px-2 text-gray-600 transition hover:text-gray-900"
            onClick={() => {
              document.getElementById('services')?.scrollIntoView({
                behavior:'smooth',
              })
            }}
          >
            Services
          </a>
          <a
            href="#"
            className="text-[16px] font-bold py-1 px-2 text-gray-600 transition hover:text-gray-900"
          >
            Help
          </a>
          <a
            href="#"
            className="text-[16px] font-bold py-1 px-2 text-gray-600 transition hover:text-gray-900"
          >
            Contact
          </a>
        </div>
        <div>
          <FontAwesomeIcon icon={faCircleUser} className="text-[#2BA197] text-5xl cursor-pointer"/>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
