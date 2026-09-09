import React, { useState } from "react";
import "../assets/Helper.css";

const Help = () => {
  const [Name1, setName1] = useState("");
  const [Name2, setName2] = useState("");
  const [PH_Number, setPH_Number] = useState("");
  const [location, setlocation] = useState("");
  const [people, setpeople] = useState("");
  const [disasterType, setDisasterType] = useState("Flash-Flood");
  const [Helps, setHelps] = useState([]);
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

  async function submitHandler(e) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const data = {
          latitude: latitude,
          longitude: longitude,
          numberOfPeopleAffected: parseInt(people, 10),
          typeOfDisaster: disasterType,
          helpsRequired: Helps,
          description: situation,
        };

        console.log(data);

        const response = await fetch(
          "https://emoticon-travesty-herald.ngrok-free.dev/victim/needhelp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          },
        );

        const result = await response.json();

        console.log(result);

        if (response.ok) {
          window.dispatchEvent(new Event("victimAdded"));

          document.getElementById("chart")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
      (error) => {
        console.error("Location error:", error);
      },
    );
  }

  const helpHandleclick = (help) => {
    if (Helps.includes(help)) {
      setHelps(Helps.filter((item) => item !== help));
    } else {
      if (Helps.length < 3) {
        const newhelps = [...Helps];
        newhelps.push(help);
        setHelps(newhelps);
      } else {
        alert("You can select only 3 help options");
      }
    }
  };

  return (
    <div
      id="help"
      className="w-full scroll-mt-10 min-h-screen pt-20 bg-[#f5fffc] pb-20"
    >
      <div id="box" className="w-full flex flex-col items-center">
        <p
          id="Victim"
          className="bg-[#f3fffc] rounded-2xl border-2 border-[#2BA197] text-[16px] font-black text-[#046e66] px-4 py-2"
        >
          VICTIM ADVOCACY
        </p>

        <h1 className="text-[30px] font-black text-[#046e66] mt-2">
          Request Help for a Victim Group
        </h1>

        <p className="text-[16px] text-gray-500 font-semibold mt-2">
          Register a disaster-affected group so that NGOs and volunteers can
          quickly locate and support them.
        </p>
      </div>

      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center mt-10 border-2 shadow-xl border-[#04756c34] bg-[#f5fffc] mx-95 py-8 rounded-2xl"
      >
        <div id="form--group" className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[18px] text-[#000000c5]">
              Group / Comunity Name
            </label>

            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="text"
              id="name"
              required
              placeholder="e.g. Maniktala Residents"
              value={Name1}
              onChange={(e) => {
                setName1(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-[18px] text-[#000000c5]">
              Contact Person Name
            </label>

            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="text"
              id="name"
              required
              placeholder="e.g. Debarpan Dutta Banik"
              value={Name2}
              onChange={(e) => {
                setName2(e.target.value);
              }}
            />
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
              Exact Location
            </label>

            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="text"
              id="location"
              required
              placeholder="Landmark,building name"
              value={location}
              onChange={(e) => {
                setlocation(e.target.value);
              }}
            />
          </div>
        </div>

        <div id="form--group" className="flex gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[18px] text-[#000000c5]">
              Number of people Affected
            </label>

            <input
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
              type="number"
              id="people"
              required
              placeholder="Estimated Head Count (e.g.80)"
              value={people}
              onChange={(e) => {
                setpeople(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-bold text-[#000000c5]">
              Type of Disaster
            </label>

            <select
              value={disasterType}
              onChange={(e) => {
                setDisasterType(e.target.value);
              }}
              required
              id="registrationType"
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#e6fff9] pl-3 pr-4 w-80 py-2 rounded-xl text-[#09786f]"
            >
              <option className="font-bold" value="Flash-Flood">
                Flash Flood
              </option>

              <option className="font-bold" value="Earthquake">
                Earthquake
              </option>

              <option className="font-bold" value="Forest-Fire">
                Forest Fire
              </option>

              <option className="font-bold" value="Epidemic">
                Epidemic
              </option>

              <option className="font-bold" value="Transport-Accident">
                Transport Accident
              </option>

              <option className="font-bold" value="Other">
                Other
              </option>
            </select>
          </div>
        </div>

        <div className="w-166 mt-4 flex flex-col gap-4">
          <p className="text-[18px] font-bold text-[#000000c5]">
            Helps Required(Check all that apply)
          </p>

          <div className="flex flex-wrap gap-4">
            {helpsList.map((help) => {
              return (
                <p
                  key={help}
                  onClick={() => helpHandleclick(help)}
                  className={`cursor-pointer border-2 border-[#09786f69] px-2.5 py-1 rounded-lg font-bold transition-all ${
                    Helps.includes(help)
                      ? "bg-[#09786f] text-white"
                      : "bg-[#e6fff9] text-[#09786f]"
                  }`}
                >
                  {help}
                </p>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col mt-6 gap-2">
          <label className="text-[18px] font-bold text-[#000000c5]">
            Situation / Short Description
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
            onClick={() =>
              document.getElementById("chart")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="w-2xl py-3 rounded-2xl cursor-pointer hover:bg-[#09786f] text-white font-bold bg-[#2BA197]"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default Help;