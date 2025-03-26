import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import NumberAnimationBar from "../components/NumberAnimationBar";
import { useLocation } from "react-router-dom";
import ImageGrid from "../components/ImageGrid";
import TeachersSection from "../components/TeachersSection";

export default function IndexPage() {
  const location = useLocation();

  // Use effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pb-5">
      <HeroSection />
      <AboutSection />

      {/* Example Number Animation Bar */}
      <div className="py-10">
        <NumberAnimationBar start={0} end={1000} duration={2000} />
      </div>
      <ImageGrid />
      <TeachersSection />
    </div>
  );
}
