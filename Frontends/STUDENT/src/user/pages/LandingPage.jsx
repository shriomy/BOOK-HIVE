import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Function to generate random text
const generateRandomText = () => {
  const randomText = [
    "The Quicksbsb hjkkbshj rjhfbg",
    "Brown Fox 5b5b5ysdysrbe 5byn ergdg sdgers",
    "Jumps Over bebts nn ertybse tbyh",
    "The Lazy Dogeb hwe egbdsn",
    "Hello Worldeb5tewb be4w 46e5he5",
    "React Three heloo dbhrsb ebrtwe 4ye4bn bhe5nb~",
  ];
  return randomText[Math.floor(Math.random() * randomText.length)];
};

function AnimatedBook({ position, isTourClicked }) {
  const { scene } = useGLTF("/images/magic_book.glb");
  const [floatY, setFloatY] = useState(0);
  const [rotation, setRotation] = useState([Math.PI / -1.9, 3, 4]);

  // Reference for initial position and rotation
  const initialRotation = useRef(rotation);
  const [currentRotation, setCurrentRotation] = useState(rotation);

  const [isMousePressed, setIsMousePressed] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState([0, 0]);

  const handleMouseDown = (event) => {
    setIsMousePressed(true);
    setLastMousePosition([event.clientX, event.clientY]);
  };

  const handleMouseMove = (event) => {
    if (isMousePressed) {
      const deltaX = event.clientX - lastMousePosition[0];
      const deltaY = event.clientY - lastMousePosition[1];

      // Calculate new rotation based on mouse movement
      const newRotation = [
        currentRotation[0],
        currentRotation[1] + deltaX * 0.01, // Adjust sensitivity for X-axis
        currentRotation[2] + deltaY * 0.01, // Adjust sensitivity for Y-axis
      ];

      setCurrentRotation(newRotation);
      setLastMousePosition([event.clientX, event.clientY]);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);

    // Animate back to the original rotation after mouse release
    let animationProgress = 0;
    const animationDuration = 500; // 500ms duration for the animation

    const animateReturn = () => {
      animationProgress += 10; // Increase the progress
      if (animationProgress < animationDuration) {
        // Lerp for smooth transition back to the initial rotation
        const lerpedRotation = [
          currentRotation[0] +
            (initialRotation.current[0] - currentRotation[0]) *
              (animationProgress / animationDuration),
          currentRotation[1] +
            (initialRotation.current[1] - currentRotation[1]) *
              (animationProgress / animationDuration),
          currentRotation[2] +
            (initialRotation.current[2] - currentRotation[2]) *
              (animationProgress / animationDuration),
        ];

        setCurrentRotation(lerpedRotation);
        requestAnimationFrame(animateReturn);
      } else {
        setCurrentRotation(initialRotation.current); // Ensure final rotation is exact
      }
    };
    animateReturn();
  };

  useFrame(({ clock }) => {
    setFloatY(Math.sin(clock.getElapsedTime() * 2) * 0.2);
  });

  return (
    <motion.group
      position={[position[0], position[1] + floatY, position[2]]}
      rotation={currentRotation} // Update rotation dynamically based on mouse movement
      animate={{
        x: isTourClicked ? -5 : 0, // Move book left when Tour is clicked
        opacity: isTourClicked ? 0 : 1, // Fade out when Tour is clicked
      }}
      transition={{ duration: 1 }}
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      onPointerOut={handleMouseUp} // Ensure to reset if mouse leaves
    >
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />

      {/* Add random text to each face of the book */}
      <Text
        position={[-0.55, 0, 0.26]} // Position for front face
        rotation={[0, Math.PI, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>
      <Text
        position={[0.55, 0, 0.26]} // Position for back face
        rotation={[0, 0, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>
      <Text
        position={[0, 0.5, -0]} // Position for top face
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>
      <Text
        position={[0, -0.55, 0.26]} // Position for bottom face
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>
      <Text
        position={[-0.55, 0, -0.26]} // Position for left face
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>
      <Text
        position={[0.55, 0, -0.26]} // Position for right face
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.1}
        color="orange"
        maxWidth={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {generateRandomText()}
      </Text>

      {/* Add the greeting text */}
      <Text
        position={[0, 1, -1]} // Position above the book
        fontSize={0.2}
        color="white"
        maxWidth={1}
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / -2, 0, 0]} // Rotate to make it more visible
      >
        Hello, we welcome you!
      </Text>
    </motion.group>
  );
}

export default function LandingPage() {
  const [isTourClicked, setIsTourClicked] = useState(false);
  const navigate = useNavigate();

  const handleTourClick = () => {
    setIsTourClicked(true);
    setTimeout(() => {
      navigate("/tour"); // Navigate to /tour when "Tour" is clicked on the model
    }, 1000);
  };

  const handleStartTourClick = () => {
    navigate("/"); // Navigate to home when "Start Tour" button is clicked
  };

  return (
    <div
      className="relative w-full h-screen text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: "url(/images/landing_bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Canvas
        className="absolute top-0 left-0 w-full h-full"
        camera={{ position: [0, 4, 4], fov: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} />
        <AnimatedBook position={[2, 2, 1.5]} isTourClicked={isTourClicked} />
        <OrbitControls
          enableZoom={false} // Allow zooming
          enableRotate={false} // Allow rotating models
          enablePan={false} // Disable panning (so the model can't be dragged)
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>

      <div
        className="relative text-center p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg z-10"
        style={{
          position: "absolute",
          left: "25%", // Move it to the left side
          top: "50%", // Vertically center the card
          transform: "translate(-50%, -50%)", // Correct the centering
        }}
      >
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Welcome to <span className="text-[#edbf6d]">Library Management</span>
        </h1>
        <p className="mt-3 text-lg text-gray-300">
          A modern and efficient way to manage your library resources.
        </p>
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "#d9a856",
            boxShadow: "0px 0px 10px #d9a856",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartTourClick}
          className="mt-4 bg-[#edbf6d] text-[#00032e] p-3 w-40 rounded-2xl text-lg font-semibold transition-all duration-300"
        >
          Start Tour
        </motion.button>
      </div>
    </div>
  );
}
