import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Helper from "./components/Helper";
import Footer from "./components/Footer";
import Service from "./components/Service";
import Chart from "./components/Chart";
import Help from "./components/Help";
import HelpDesk from "./components/HelpDesk";
import VictimAuth from "./components/VictimAuth";
import VictimLogin from "./components/VictimLogin";
import DonorAuth from "./components/DonorAuth";
import DonorLogin from "./components/DonorLogin";

const App = () => {
  return (
    <BrowserRouter>
      <div className="h-screen w-full relative">
        <Routes>
              <Route path='/' element={<HelpDesk/>} />
              <Route path="/victim/signup" element={<VictimAuth/>} />
              <Route path="/victim/login" element={<VictimLogin/>} />
              <Route path="/Donor/signup" element={<DonorAuth/>} />
              <Route path="/Donor/Login" element={<DonorLogin/>} />
              <Route path="/victim/home" element={
                <>
                  <Navbar/>
                  <Home/>
                  <Help/>
                  <Chart/>
                  <Service/>
                  <Footer/>
                </>
              } />
              <Route path="/helper/home" element={
                <>
                  <Navbar/>
                  <Home/>
                  <Helper/>
                  <Chart/>
                  <Service/>
                  <Footer/>
                </>
              } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;