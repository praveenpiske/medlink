import React from "react";
import { Routes, Route } from "react-router";
import useScrollRestore from "../hooks/useScrollRestore";
import LandingPage from "../pages/LandingPage";
import Home from "../pages/Home";
import Doctors from "../pages/Doctors";
import MeetPage from "../pages/MeetPage";
import ErrorPage from "../pages/ErrorPage";

const RouterRoutes = () => {
  useScrollRestore();

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/instant-meet" element={<MeetPage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default RouterRoutes;
