import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chart = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    getData();
    const handleVictimAdded = () => {
      getData();
    };
    window.addEventListener("victimAdded", handleVictimAdded);
    return () => {
      window.removeEventListener("victimAdded", handleVictimAdded);
    };
  }, []);

  const getData = async () => {
    const response = await fetch(
      "https://emoticon-travesty-herald.ngrok-free.dev/getallvictim",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();
    console.log("Fetched Data:", result);
    setFormData(Array.isArray(result?.data) ? result.data : []);
  };

  const formatHelpRequired = (helpRequired) => {
    if (Array.isArray(helpRequired)) {
      return helpRequired.length > 0
        ? helpRequired.join(", ")
        : "None specified";
    }
    return helpRequired || "None specified";
  };

  return (
    <div
      id="chart"
      className="w-full scroll-mt-26 max-h-screen bg-[#f5fffc] pb-10"
    >
      <div className="w-full flex flex-col items-center mb-7">
        <p className="bg-[#f3fffc] rounded-2xl border-2 border-[#2BA197] text-[16px] font-black text-[#046e66] px-4 py-2">
          ACTIVE CASES
        </p>
        <p className="text-[16px] text-gray-500 font-semibold mt-2">
          Real-time dashboard of affected zones needing immediate assistance.
          Filter and assist directly.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <input
          className="h-11 w-[72.3%] bg-[#e6fff9] text-[15px] font-semibold border-2 border-[#2ba19741] rounded-2xl px-6 py-2 outline-none"
          placeholder="Search requests by location, group, or help needed..."
        />
        <button className="h-11 w-25 bg-[#2BA197] text-white font-black text-[16px] hover:bg-[#046e66] cursor-pointer rounded-2xl">
          Search
        </button>
      </div>

      <div className="flex justify-center mt-10">
        <div className="w-[80%] h-120 bg-[#f5fffc] border-2 border-[#2ba19741] shadow-2xl rounded-4xl overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-5 py-2 font-bold border-b-2 border-[#2ba19741] bg-[#e6fff9] text-center sticky top-0 z-10">
            <p>Location</p>
            <p>People Affected</p>
            <p>Help Needed</p>
            <p>Status</p>
            <p>Action</p>
          </div>

          {formData.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              No active requests found.
            </p>
          ) : (
            formData.map((data, index) => {
              const itemStatus = data?.status || "pending";

              return (
                <div
                  key={data?._id || index}
                  className="grid grid-cols-5 text-center py-3 font-semibold mb-1 bg-gray-100 items-center border-b border-gray-200"
                >
                  <p className="text-xs">{data?.exactLocation || "N/A"}</p>
                  <p>{data?.numberOfPeopleAffected ?? 0}</p>
                  <p>{formatHelpRequired(data?.helpsRequired)}</p>
                  <p
                    className={`font-bold capitalize ${
                      itemStatus === "pending"
                        ? "text-orange-700"
                        : "text-[#08847a]"
                    }`}
                  >
                    {itemStatus}
                  </p>
                  <button
                    onClick={() =>
                      navigate("/victimDashboard", {
                        state: { victim: data },
                      })
                    }
                    className="bg-[#e6fff9] text-[#046e66] mx-12 rounded-xl py-1 cursor-pointer hover:text-white hover:bg-[#046e66] transition-colors"
                  >
                    View
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
