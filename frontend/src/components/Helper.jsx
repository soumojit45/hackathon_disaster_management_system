import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faWeightHanging, faImage } from "@fortawesome/free-solid-svg-icons";
import "../assets/Helper.css";

const Helper = () => {
  const [Name, setName] = useState("");
  const [Reg, setReg] = useState("NGO");
  const [PH_Number, setPH_Number] = useState("");
  const [email, setemail] = useState("");
  const [location, setlocation] = useState("");
  const [help, sethelp] = useState([]);
  const [situation, setsituation] = useState("");

  const helpsList = [
    "Food",
    "Medical",
    "Shelter",
    "Transportation",
    "Clothing",
    "Volunteers",
    "Baby Supplies",
    "Sanitary Products",
    "Other",
  ];

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      fullName: Name,
      registrationType: Reg,
      phoneNumber: PH_Number,
      email: email,
      destination: location,
      helpAvailable: help,
      description: situation
    };

    console.log(data);

    const response = await fetch(
      "https://emoticon-travesty-herald.ngrok-free.dev/helper/addHelp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(data)
      },
    );

    const result = await response.json();
    console.log(result);
  };

  const helphandleclick = (item) => {
    if (help.includes(item)) {
      sethelp(help.filter((e) => e != item));
    } else {
      const newData = [...help];
      newData.push(item);
      sethelp(newData);
    }
  };

  return (
    <div id="helper" className="w-full min-h-screen scroll-mt-10 pt-20 bg-[#f5fffc] pb-20">
      <div className="w-full flex flex-col items-center">
        <p className="bg-[#f3fffc] rounded-2xl border-2 border-[#2BA197] text-[16px] font-black text-[#046e66] px-4 py-2">
          JOIN US
        </p>
        <h1 className="text-[30px] font-black text-[#046e66] mt-2">
          Register as a Helper
        </h1>
        <p className="text-[16px] text-gray-500 font-semibold mt-2">
          NGOs and individuals can register to provide support during disasters.
          Your involvement
        </p>
      </div>
      <form
        onSubmit={function (e) {
          submitHandler(e);
        }}
        className="flex flex-col items-center mt-10 border-2 shadow-xl border-[#04756c34] bg-[#f5fffc] mx-95 py-8 rounded-2xl"
      >
        <div id="form--group" className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[18px] text-[#000000c5]">
              Full Name / Organization Name
            </label>
            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="text"
              id="name"
              required
              placeholder="e.g. Hope NGO or Sarah Jenkins"
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-bold text-[#000000c5]">
              Registration Type
            </label>

            <select
              value={Reg}
              onChange={(e) => {
                setReg(e.target.value);
              }}
              required
              id="registrationType"
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
            >
              <option className="font-bold" value="NGO">
                NGO
              </option>
              <option className="font-bold" value="Individual">
                Individual
              </option>
            </select>
          </div>
        </div>
        <div id="form-row" className="flex gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-bold text-[#000000c5]">
              Phone Number
            </label>
            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="tel"
              id="phone"
              required
              placeholder="+91 98765 43210"
              value={PH_Number}
              onChange={(e) => {
                setPH_Number(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-bold text-[#000000c5]">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="email"
              id="email"
              required
              placeholder="helper@example.org"
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 gap-2">
          <label className="text-[18px] font-bold text-[#000000c5]">
            Location / Operating Area
          </label>
          <input
            className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-166 py-2 rounded-xl text-[#09786f]"
            type="text"
            id="location"
            required
            placeholder="City, State, Region or GPS coordinates"
            value={location}
            onChange={(e) => {
              setlocation(e.target.value);
            }}
          />
        </div>
        <div className="w-166 mt-4 flex flex-col gap-4">
          <p className="text-[18px] font-bold text-[#000000c5]">
            Type of Help Avaliable
          </p>
          <div id="helper" className="flex flex-wrap gap-4">
            {helpsList.map((data) => {
              return (
                <p
                  key={data}
                  onClick={() => helphandleclick(data)}
                  className={`cursor-pointer border-2 border-[#09786f69] px-2.5 py-1 rounded-lg font-bold transition-all
                    ${help.includes(data) ? "bg-[#09786f] text-white" : "bg-[#e6fff9] text-[#09786f]"}
                    `}
                >
                  {data}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col mt-6 gap-2">
          <label className="text-[18px] font-bold text-[#000000c5]">
            Available Resources / Short Description
          </label>
          <textarea
            className="text-[16px] focus:outline-none border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-166 py-2 rounded-xl text-[#09786f]"
            id="resources"
            rows="5"
            required
            placeholder="Tell us about the supplies....."
            value={situation}
            onChange={(e) => {
              setsituation(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="mt-7">
          <button
            type="submit"
            className="w-2xl py-3 rounded-2xl flex gap-3 items-center justify-center cursor-pointer hover:bg-[#09786f] text-white font-bold bg-[#2BA197]"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Register as Helper
          </button>
        </div>
      </form>
    </div>
  );
};

export default Helper;