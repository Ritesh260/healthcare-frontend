import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import ambulanceAnimation from "../animations/ambulance.json"; // ye tum download karoge lottiefiles se
import "../SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // 3-4 sec ke baad main site show
    }, 4000); // 4 sec animation
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <Lottie
        animationData={ambulanceAnimation}
        loop={true}
        className="splash-animation"
      />
      <h1 className="splash-text">
        <span className="accent">SEHAT</span> SATHI
      </h1>
      <p>
        Empowering rural and remote areas with reliable emergency medical and
        ambulance services — because every life matters.
      </p>
    </div>
  );
};

export default SplashScreen;
