import React, { Suspense, useState } from "react";
import Scene from "../models/Scene";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faShieldHalved,
  faBolt,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const VictimAuth = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Mob, setMob] = useState("");
  const [Pass, setPass] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      contactPersonName: Name,
      email: Email,
      phoneNumber: Mob,
      password: Pass,
    };

    console.log(data);

    const response = await fetch(
      "https://emoticon-travesty-herald.ngrok-free.dev/victim/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    console.log(result);

    if (response.ok) {
      navigate("/victim/home");
      localStorage.setItem("role","victim")
    } else {
      console.log(result.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center px-30 bg-[#f3fffe]">
      <div className="w-full lg:w-3/6 flex pt-14 pb-15 pl-12 justify-start">
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="w-full max-w-lg bg-white border-2 border-[#03504a4e] p-8 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center justify-center">
              <p>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-[#09786f] mb-2 text-3xl bg-[#32decf49] p-3 rounded-xl"
                />
              </p>
              <p className="text-2xl font-black text-[#09786f]">
                Create Account
              </p>
            </div>
            <p className="text-[#048076b0] font-bold mt-1.5">
              Register as a victim to access emergency support.
            </p>
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[17px] text-[#0000008f]">
              Full Name
            </label>

            <input
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[18px] text-[#0000008f]">
              Email
              <span className="font-bold text-[17px] text-[#0000008f]">
                {" "}
                (Optional)
              </span>
            </label>
            <input
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="email"
              placeholder="Enter your email"
              className="text-[16px] border-2 h-12 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[17px] text-[#0000008f]">
              Phone Number
            </label>
            <input
              value={Mob}
              onChange={(e) => {
                setMob(e.target.value);
              }}
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="text-[16px] h-12 border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[17px] text-[#0000008f]">
              Password
            </label>
            <input
              value={Pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
              type="password"
              name="password"
              placeholder="Create a password"
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#09786f] mt-2 cursor-pointer text-[18px] hover:bg-[#02564f] text-white font-bold py-3 rounded-xl transition duration-200"
          >
            Create Account
          </button>
          <p className="text-center font-bold text-[16px] text-[#048076b0] mt-6">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/victim/login")}
              href="#"
              className="text-[#034b45] font-bold hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
      <div className="hidden flex-col lg:flex w-3/6 items-center pb-14 pt-14 h-screen">
        <div className="flex w-full justify-between items-center bg-[#06bdae30] px-4 gap-3 py-2 rounded-2xl">
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="text-xl mb-5 text-[#048076f3]"
            />
            <div className="flex text[16px] font-bold flex-col gap-[1px]">
              <p className="text-[#024943]">Trusted & Secure</p>
              <p className="text-[#048076de]">Your data is safe</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon
              icon={faBolt}
              className="text-xl mb-5 text-[#048076f3]"
            />
            <div className="flex flex-col gap-[1px] text-[16px] font-bold">
              <p className="text-[#024943]">Quick Access</p>
              <p className="text-[#048076de]">Get help when need it</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-xl mb-5 text-[#048076f3]"
            />
            <div className="flex flex-col gap-[1px] text-[16px] font-bold">
              <p className="text-[#024943]">We Care</p>
              <p className="text-[#048076de]">We can save lives</p>
            </div>
          </div>
        </div>
        <div>
          <img className="my-13 rounded-xl shadow-2xl" src="/disaster_image.jpeg"></img>
        </div>
        {/* <Canvas
          camera={{
            position: [0, 1.5, 5],
            fov: 50,
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={null}>
            <Scene scale={1.5} />
          </Suspense>
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={5}
            blur={4}
            far={6}
          />
          <OrbitControls
            enableZoom={false}
            enableRotate={true}
            minPolarAngle={Math.PI / 2.3}
            maxPolarAngle={Math.PI / 2.3}
          />
        </Canvas> */}
        <div className="flex items-center gap-3 bg-[#06bdae30] font-bold text-[16px] rounded-2xl px-6 py-4 text-[#048076fa]">
          <FontAwesomeIcon icon={faBell} className="text-[#048076f3] pb-5.5" />
          <p>
            Email is optional. However, providing your email address allows you
            to track your status and receive important updates promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VictimAuth;
