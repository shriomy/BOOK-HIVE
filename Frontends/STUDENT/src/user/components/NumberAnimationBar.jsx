import { useEffect, useState, useRef } from "react";

const statsData = [
  { id: 1, icon: "📖", end: 500, label: "Books" },
  { id: 2, icon: "🎓", end: 1900, label: "Users" },
  { id: 3, icon: "👨‍🏫", end: 750, label: "Skilled Lecturers" },
  { id: 4, icon: "🏆", end: 30, label: "Win Awards" },
];

const NumberAnimationBar = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.backgroundPosition = `center ${
          scrollY * 0.5
        }px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={parallaxRef}
      className="relative bg-cover bg-center py-16 text-white"
      style={{
        backgroundImage: "url('/images/numbers_bg.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#2c1f19] bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {statsData.map((item) => (
          <StatCard
            key={item.id}
            icon={item.icon}
            end={item.end}
            label={item.label}
          />
        ))}
      </div>
    </section>
  );
};

const StatCard = ({ icon, end, label }) => {
  const [count, setCount] = useState(0);
  const numberRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const currentRef = numberRef.current;

    const startAnimation = () => {
      let current = 0;
      const step = end / 200; // Slower animation (increased denominator)
      const animationDuration = 3000; // 3 seconds total animation time
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        current = Math.floor(progress * end);

        if (progress < 1) {
          if (isMounted) setCount(current);
          animationRef.current = requestAnimationFrame(updateCount);
        } else {
          if (isMounted) setCount(end);
        }
      };

      animationRef.current = requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      isMounted = false;
      if (currentRef) observer.unobserve(currentRef);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end]);

  return (
    <div ref={numberRef} className="flex flex-col items-center space-y-3">
      <div className="relative bg-orange-400 p-5 rounded-full shadow-lg">
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="text-5xl font-bold">{count}</div>
      <p className="text-lg font-medium">{label}</p>
    </div>
  );
};

export default NumberAnimationBar;
