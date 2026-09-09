import React, { Suspense, useState } from "react";
import Scene from "../models/Scene";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser , faBell , faGift , faHandHoldingHeart , faShieldHalved , faBolt , faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const VictimAuth = () => {

  const [Email, setEmail] = useState("")
  const [Pass, setPass] = useState("")

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      email : Email,
      password : Pass
    }

    console.log(data)

    const response = await fetch(
      "https://emoticon-travesty-herald.ngrok-free.dev/helper/login",
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

    if(response.ok){
      navigate("/helper/home")
      localStorage.setItem("role","helper")
    }else{
      console.log(response.message)
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center px-30 bg-[#f3fffe]">
      <div className="w-full lg:w-3/6 flex justify-center py-15">
        <form 
        onSubmit={(e) => {
          submitHandler(e);
        }}
        className="w-full max-w-lg bg-[#fff] border-2 border-[#03504a4e] p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center justify-center">
            <p>
              <FontAwesomeIcon icon={faUser} className="text-[#09786f] mb-2 text-3xl bg-[#32decf49] p-3 rounded-xl" />
            </p>
            <p className="text-2xl font-black text-[#09786f]">
              Login Now
            </p>
            </div>
            <p className="text-[#048076d2] font-bold mt-1.5">
              Join hands. Make a difference. Save lives.
            </p>
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[18px] text-[#0000008f]">
              Email
            </label>
            <input
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="text-[16px] border-2 h-12 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <div className="mb-5 flex flex-col gap-1">
            <label className="font-bold text-[17px] text-[#0000008f]">
              Password
            </label>
            <input
              value={Pass}
              onChange={(e) => {
                setPass(e.target.value)
              }}
              type="password"
              name="password"
              required
              placeholder="Create a password"
              className="text-[16px] border-2 border-[#08615965] placeholder:text-[#08615964] font-bold bg-[#f2fffc] pl-3 pr-4 w-full py-2 rounded-xl text-[#09786f]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#09786f] mt-6 flex items-center justify-center cursor-pointer text-[18px] hover:bg-[#02564f] text-white font-bold py-3 rounded-xl transition duration-200"
          >
            Login
          </button>
          <p className="text-center font-bold text-[16px] text-[#048076b0] mt-6">
            Don't have an account?{" "}
            <a
            onClick={() => navigate("/Donor/signup")}
            href="#" className="text-[#034b45] font-bold hover:underline">
              Create Account
            </a>
          </p>
          <div className="flex items-center justify-center gap-2 mt-16 font-bold text-[16px]">
            <FontAwesomeIcon icon={faHeart} className="text-[#09786f]" />
            <p className="text-[#09786fd2]">Your kindness today can change someone’s tomorrow.</p>
          </div>
        </form>
      </div>
      <div className="hidden flex-col lg:flex w-3/6 items-center pb-15 pt-15 h-screen">
       <div className="flex w-full justify-between items-center bg-[#06bdae30] px-4 gap-3 py-2 rounded-2xl">
          <div className="flex items-center justify-center gap-1.5">
            <FontAwesomeIcon icon={faShieldHalved} className="text-xl pb-5 text-[#048076f3]" />
            <div className="flex text[16px] font-bold flex-col gap-[1px]">
              <p className="text-[#024943]">Trusted & Secure</p>
              <p className="text-[#048076de]">Your data is safe</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FontAwesomeIcon icon={faBolt} className="text-xl pb-5 text-[#048076f3]" />
            <div className="flex flex-col gap-[1px] text-[16px] font-bold">
              <p className="text-[#024943]">Quick Access</p>
              <p className="text-[#048076de]">Get help when need it</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FontAwesomeIcon icon={faHeart} className="text-xl pb-5 text-[#048076f3]" />
            <div className="flex flex-col gap-[1px] text-[16px] font-bold">
              <p className="text-[#024943]">We Care</p>
              <p className="text-[#048076de]">We can save lives</p>
            </div>
          </div>
       </div>
        <Canvas
          camera={{
            position: [0, 1.5, 5],
            fov: 50,
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={null}>
            <Scene scale={1.6} />
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
        </Canvas>
        <div className="flex items-center gap-5 bg-[#06bdae30] font-bold text-[16px] rounded-2xl px-6 py-4 text-[#048076fa]">
          <FontAwesomeIcon icon={faGift} className="text-[#048076f3] text-2xl pb-5.5" />
          <div className="flex flex-col gap-1 justify-center">
            <p className="text-[#066755] font-black">Why register as a donor ?</p>
            <p className="text-[15px]">Registering helps us connect with you, keep you updated on impact, and make your giving journey meaningful.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimAuth;