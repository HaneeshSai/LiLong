import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import DashBoard from "./pages/DashBoard";
import useStore from "./store";

export default function App() {
  const { isloading, setIsloading } = useStore();
  return (
    <div className="font-medium">
      {isloading ? (
        <div className="h-screen w-screen absolute top-1 backdrop-blur-lg z-20">
          <div id="preloader">
            <div id="loader"></div>
          </div>
        </div>
      ) : null}

      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </div>
  );
}
