import React, { useState, useEffect, useRef } from "react";

import { GiBookshelf } from "react-icons/gi";
import CustomButton from "./CustomButton";
import { GiTeacher } from "react-icons/gi";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosWifi } from "react-icons/io";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const featuresRef = useRef(null);

  const slides = [
    "/images/slider1.jpg",
    "/images/slider2.jpg",
    "/images/slider3.jpg",
    "/images/slider4.jpg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsContentVisible(false);
    setTimeout(() => setIsContentVisible(true), 300);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsContentVisible(false);
    setTimeout(() => setIsContentVisible(true), 300);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    // Initial content visibility
    setIsContentVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden pb-10">
      {/* Background Image Container */}
      <div className="relative min-h-screen">
        {/* Background Image with Enhanced Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url('${slides[currentSlide]}')`,
            transform: `scale(${currentSlide === 0 ? "1" : "1.05"})`,
            opacity: currentSlide === 0 ? 1 : 0.8,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-4xl mx-auto px-6 pt-20">
          <div
            className={`
            space-y-6 transform transition-all duration-700 ease-out
            ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
          >
            <div className="inline-block py-2 px-4 bg-orange-500/20 rounded-full">
              <h3 className="text-[#edbf6d] text-sm font-medium uppercase tracking-widest">
                Welcome to Book-hive
              </h3>
            </div>
            <h1 className="text-white text-6xl font-extrabold leading-tight">
              Resources to <br />
              <span className="text-orange-500">Achieve</span> Your Academic
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                {" "}
                Targets
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              Unlock your potential with our comprehensive library of resources,
              carefully curated to support your academic journey and personal
              growth.
            </p>
            <div className="mt-8 flex gap-4 items-center">
              <CustomButton
                text="Explore Resources"
                className="shadow-xl hover:shadow-orange-500/50"
              />
              <button className="group relative overflow-hidden bg-white text-gray-800 px-8 py-4 rounded-full font-semibold transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-orange-500/30">
                <span className="relative z-20">Learn More →</span>
                <span className="absolute inset-0 bg-orange-600 origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-10"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          onClick={prevSlide}
        >
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-xl cursor-pointer hover:bg-white/30 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={nextSlide}
        >
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-xl cursor-pointer hover:bg-white/30 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section - Positioned to overlap image */}
      <div
        ref={featuresRef}
        className="relative z-20 -mt-24 mx-auto max-w-[1200px] px-4"
      >
        <div className="grid grid-cols-4 gap-6">
          <FeatureCard
            icon={<GiBookshelf />}
            title="Reserve Books"
            description="Access a vast collection of academic resources."
            index={0}
            isVisible={isVisible}
          />
          <FeatureCard
            icon={<GiTeacher />}
            title="Lecturers Help"
            description="Get expert guidance and academic support."
            index={1}
            isVisible={isVisible}
          />
          <FeatureCard
            icon={<FaPeopleGroup />}
            title="Study Rooms"
            description="Collaborative spaces for effective learning."
            index={2}
            isVisible={isVisible}
          />
          <FeatureCard
            icon={<IoIosWifi />}
            title="Free WiFi"
            description="Stay connected with high-speed internet access."
            index={3}
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index, isVisible }) => {
  return (
    <div
      className={`
        bg-white shadow-xl p-8 rounded-3xl text-center transform transition-all duration-500 
        hover:-translate-y-3 relative overflow-hidden group
        ${
          isVisible
            ? `opacity-100 translate-y-0 delay-${index * 100}`
            : "opacity-0 translate-y-10"
        }
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out opacity-0 group-hover:opacity-100"></div>

      <div className="relative z-10 text-5xl mb-4 text-orange-600 flex justify-center transition-colors group-hover:text-white">
        {icon}
      </div>
      <h3 className="relative z-10 font-bold text-gray-900 text-xl mb-3 transition-colors group-hover:text-white">
        {title}
      </h3>
      <p className="relative z-10 text-gray-600 text-base transition-colors group-hover:text-white/90">
        {description}
      </p>
    </div>
  );
};

export default HeroSection;
