import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export default function CustomAlert({
  variant = "danger",
  message,
  show,
  onClose,
  autoClose = true,
  duration = 5000,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState(
    "translate-x-full opacity-0"
  );

  // Get the background and text colors based on variant
  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-[#1A2421] bg-opacity-100",
          border: "border-[#063c2a]",
          text: "text-green-400",
        };
      case "danger":
        return {
          bg: "bg-[#420D09] bg-opacity-100",
          border: "border-[#D30000]",
          text: "text-red-100",
        };
      case "warning":
        return {
          bg: "bg-yellow-800",
          border: "border-yellow-700",
          text: "text-yellow-100",
        };
      case "info":
        return {
          bg: "bg-blue-900",
          border: "border-blue-800",
          text: "text-blue-100",
        };
      default:
        return {
          bg: "bg-gray-800",
          border: "border-gray-700",
          text: "text-gray-100",
        };
    }
  };

  useEffect(() => {
    if (show) {
      // First make the alert visible but off-screen
      setIsVisible(true);

      // After a small delay, animate it into view
      setTimeout(() => {
        setAnimationClass("translate-x-0 opacity-100");
      }, 50);

      // Auto close after duration if autoClose is true
      let timer;
      if (autoClose) {
        timer = setTimeout(() => {
          // Start hiding animation
          setAnimationClass("translate-x-full opacity-0");

          // After animation completes, hide the element
          setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
          }, 300); // Match transition duration
        }, duration);
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Animate out
      setAnimationClass("translate-x-full opacity-0");

      // After animation completes, hide the element
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match transition duration
    }
  }, [show, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const styles = getStyles();

  // Use a portal to render the alert at the document body level
  return ReactDOM.createPortal(
    <div
      className="fixed top-4 right-4 z-50 max-w-sm"
      style={{ position: "fixed", maxWidth: "20rem" }}
    >
      <div
        className={`${styles.bg} border ${styles.border} ${styles.text} p-4 rounded-md shadow-lg ${animationClass} transition-all duration-300 ease-in-out`}
        style={{
          transform: animationClass.includes("translate-x-full")
            ? "translateX(100%)"
            : "translateX(0)",
          opacity: animationClass.includes("opacity-0") ? 0 : 1,
          transition: "all 300ms ease-in-out",
        }}
      >
        <div className="flex items-center">
          <div className="flex-grow">{message}</div>
          <button
            onClick={() => {
              setAnimationClass("translate-x-full opacity-0");
              setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
              }, 300);
            }}
            className={`ml-4 ${styles.text} hover:text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
