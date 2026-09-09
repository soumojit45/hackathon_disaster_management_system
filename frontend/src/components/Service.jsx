import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen , faStreetView , faPhone } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Service = () => {
  return (
    <div id="services" className="w-full max-h-screen scroll-mt-20 pt-10 bg-[#f5fffc] pb-20">
      <div className="w-full flex flex-col items-center">
        <p className="bg-[#f3fffc] rounded-2xl border-2 border-[#2BA197] text-[16px] font-black text-[#046e66] px-4 py-2">
          FLOW
        </p>
        <h1 className="text-[30px] font-black text-[#046e66] mt-2">
          How It Works
        </h1>
        <p className="text-[16px] text-gray-500 font-semibold mt-2">
            Simple, direct bridge coordination designed to maximize speed and accuracy during
            emergency scenarios.
        </p>
      </div>
      <div className="flex gap-24 mt-12 justify-center">
        <div id="box1" className="h-60 w-80 flex cursor-pointer shadow-xl rounded-2xl bg-[#e6fff9] border-2 border-[#046e6583] flex-col items-center gap-2 px-3 py-5 transition-transform duration-300 hover:-translate-y-3">
            <FontAwesomeIcon icon={faBookOpen} className="text-[#046e66] text-2xl bg-[#e6fff9] px-2 py-2.5 rounded-4xl border-2 border-[#046e6583]"/>
            <h1 className="text-[#046e66] text-[22px] font-black mt-4">Register Now</h1>
            <p className="text-center font-medium">NGOs, volunteers register resources. Victims or community leaders register help needs.</p>
        </div>
        <div id="box1" className="h-60 w-80 flex cursor-pointer shadow-xl rounded-2xl bg-[#e6fff9] border-2 border-[#046e6583] flex-col items-center gap-2 px-3 py-5 transition-transform duration-300 hover:-translate-y-3">
            <FontAwesomeIcon icon={faStreetView} className="text-[#046e66] text-2xl bg-[#e6fff9] px-2 py-2.5 rounded-4xl border-2 border-[#046e6583]"/>
            <h1 className="text-[#046e66] text-[22px] font-black mt-4">View & Contact</h1>
            <p className="text-center font-medium">Search, locate, and filter active matches automatically by region, urgency and type.</p>
        </div>
        <div id="box1" className="h-60 w-80 cursor-pointer shadow-xl flex rounded-2xl bg-[#e6fff9] border-2 border-[#046e6583] flex-col items-center gap-2 px-3 py-5 transition-transform duration-300 hover:-translate-y-3">
            <FontAwesomeIcon icon={faPhone} className="text-[#046e66] text-2xl bg-[#e6fff9] px-2 py-2.5 rounded-4xl border-2 border-[#046e6583]"/>
            <h1 className="text-[#046e66] text-[22px] font-black mt-4">Provide Support</h1>
            <p className="text-center font-medium">Direct communication, tracking updates, and resource verification ensure aid arrives.</p>
        </div>
      </div>
      <div className="mt-20 flex items-center bg-red-100 gap-4 justify-center mx-10 py-8 px-6 rounded-3xl">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-600 text-3xl pb-12"/>
        <div className="flex flex-col gap-2">
            <h1 className="text-[20px] font-black text-red-600">Emergency?</h1>
            <p className="text-[16px] font-bold">This platform serves as a coordination tool for organizations and
                volunteers. For immediate life-threatening emergencies, please contact
                your local national emergency services instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Service;
