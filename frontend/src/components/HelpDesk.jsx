import { Navigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React from "react";

import {
  faCircleUser,
  faHouseFloodWater,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e8fff8] via-[#d9f7f0] to-[#eefcf9] text-gray-800">
      <header className="h-[150px] bg-[#feffff] backdrop-blur-md border-b border-black/5 flex items-center px-[8%]">
        <div className="flex items-center gap-6">
          <div className="w-[75px] h-[75px] rounded-2xl bg-[#d7ffef] flex items-center justify-center text-4xl shadow-sm">
            <FontAwesomeIcon icon={faHouseFloodWater} className="text-[#09786f]" />
          </div>
          <div>
            <h1 className="text-[28px] tracking-[1px] font-black text-[#087f5b]">
              RAKSHA{" "}SETU
            </h1>
            <p className="mt-1 text-[18px] font-bold text-[#0a8177d4] tracking-wide">
              Disaster Management & Relief Portal
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-[70px]">
        <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-7">
          <div className="relative overflow-hidden min-h-[410px] rounded-[25px] border border-white/80 bg-white/65 backdrop-blur-xl shadow-[0_20px_50px_rgba(26,91,77,0.12)] p-8 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-white/35"></div>
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl mb-5">
              👤
            </div>
            <span className="block text-[15px] tracking-[2px] font-bold text-orange-600 mb-2">
              PUBLIC ACCESS
            </span>
            <h2 className="font-serif text-[28px] font-bold text-gray-900">
              Victim / Citizen
            </h2>
            <div className="h-px bg-black/10 my-6"></div>
            <p className="text-[17px] font-medium leading-[1.6] text-gray-700 max-w-[440px]">
              Disaster affected citizens can register their
              information, request emergency assistance and
              track the status of their relief application.
            </p>
            <div className="mt-16">
              <button
                onClick={() => navigate("/victim/signup")}
                type="button"
                className="
                  text-lg
                  w-full h-[50px]
                  rounded-xl
                  border-none
                  bg-white/85
                  text-orange-600
                  font-semibold
                  flex items-center justify-center gap-3
                  shadow-sm
                  hover:bg-orange-500
                  hover:text-white
                  hover:-translate-y-0.5
                  transition-all duration-200
                  cursor-pointer
                "
              >
                Access Victim Portal
                <span>→</span>
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[410px] rounded-[25px] border border-white/80 bg-white/65 backdrop-blur-xl shadow-[0_20px_50px_rgba(26,91,77,0.12)] p-8 hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-white/35"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-5">
              🤝
            </div>
            <span className="block text-[15px] tracking-[2px] font-bold text-[#245a7c] mb-2">
              RELIEF & SUPPORT
            </span>
            <h2 className="font-serif text-[28px] font-bold text-gray-900">
              Provide Assistance
            </h2>
            <div className="h-px bg-black/10 my-6"></div>
            <p className="text-[17px] font-semibold leading-[1.6] text-gray-700">
              Join the disaster response network and provide
              support to affected people through your
              organization, skills or resources.
            </p>
            <div className="flex flex-col gap-3 mt-7">
              <button
                onClick={() => 
                  navigate("/Donor/signup",{
                    state:{role:"NGO"}
                  })
                }
                type="button"
                className="
                  text-lg
                  w-full h-[50px]
                  rounded-xl
                  bg-white/85
                  text-[#174a68]
                  font-semibold
                  px-5
                  grid grid-cols-[35px_1fr_30px]
                  items-center
                  text-left
                  hover:bg-[#174a68]
                  hover:text-white
                  hover:translate-x-1
                  transition-all duration-200
                  cursor-pointer
                "
              >
                <span>🏢</span>
                <span>NGO</span>
                <span>→</span>
              </button>
              <button
                className="
                  text-lg
                  w-full h-[50px]
                  rounded-xl
                  bg-white/85
                  text-[#174a68]
                  font-semibold
                  px-5
                  grid grid-cols-[35px_1fr_30px]
                  items-center
                  text-left
                  hover:bg-[#174a68]
                  hover:text-white
                  hover:translate-x-1
                  transition-all duration-200
                  cursor-pointer
                "
              >
                <span>🦺</span>
                <span>Volunteer</span>
                <span>→</span>
              </button>
              <button
                onClick={() => 
                  navigate("/Donor/signup",{
                    state:{role:"Individual"}
                  })
                }
                className="
                  text-lg
                  w-full h-[50px]
                  rounded-xl
                  bg-white/85
                  text-[#174a68]
                  font-semibold
                  px-5
                  grid grid-cols-[35px_1fr_30px]
                  items-center
                  text-left
                  hover:bg-[#174a68]
                  hover:text-white
                  hover:translate-x-1
                  transition-all duration-200
                  cursor-pointer
                "
              >
                <span>👤</span>
                <span>Individual</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;