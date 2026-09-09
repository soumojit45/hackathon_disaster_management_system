import React from "react";

const App = () => {
  const role = localStorage.getItem("role");

  return (
    <div
      id="container"
      className="min-h-screen flex flex-col items-center pt-28 bg-[#f5fffc]"
    >
      <div id="head">
        <p className="text-[16px] font-bold border-2 border-[#2BA197] px-8 py-2 rounded-4xl bg-[#f3fffc] mb-6">
          United in Times of Crisis
        </p>
      </div>
      <div id="heading">
        <h1 className="text-[50px] font-extrabold text-center leading-16 mb-4">
          Connecting Help with <span className="text-[#118b81]">Those Who</span>{" "}
          Need <br /> It Most
        </h1>
      </div>
      <p className="max-w-3xl text-[18px] font-medium leading-7.5 text-slate-600 text-center mb-5">
        A simple platform connecting NGOs, volunteers, and disaster-affected
        communities. Standardizing the flow of resources to drive faster,
        coordinated disaster recovery.
      </p>
      <div id="btn" className="flex gap-6 mt-3 text-[16px] font-bold mb-10">
        {role == "helper" && (
          <button
            onClick={() =>
              document.getElementById("helper")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            id="btn1"
            className=" bg-[#118b81] text-white px-6 py-3 rounded-2xl cursor-pointer"
          >
            Provide Relief
          </button>
        )}
        {role == "victim" && (
          <button
            onClick={() =>
              document.getElementById("help")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            id="btn2"
            className="bg-[#f2fffc] cursor-pointer text-[#118b81] px-5 py-3 border-2 border-[#118b81] rounded-2xl hover:bg-[#118b81] hover:text-white"
          >
            Request Help
          </button>
        )}
      </div>
      <div className="rounded-4xl overflow-hidden shadow-2xl">
        <video
          src="/video01.mp4"
          className="h-[600px] w-[1200px] object-cover"
          autoPlay
          muted
          loop
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default App;
