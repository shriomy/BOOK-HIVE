import React from "react";
import { motion } from "framer-motion";

const MasonryImageGrid = ({ images }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center text-[#2c1f19] mb-8 mt-6"
      >
        Explore Our Resource Collections
      </motion.h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex space-x-2 p-6 h-[600px]"
      >
        <motion.div
          variants={itemVariants}
          className="w-1/3 flex flex-col space-y-2"
        >
          <div className="h-2/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/IT.jpg"
              alt="IT Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  IT Related Books/Resources
                </p>
              </div>
            </div>
          </div>
          <div className="h-1/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/ENG.png"
              alt="Engineering Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  Engineering Related Books/Resources
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-1/3 flex flex-col space-y-2"
        >
          <div className="h-1/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/HUM.jpeg"
              alt="Humanity & Sciences Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  Humanity & Sciences Books/Resources
                </p>
              </div>
            </div>
          </div>
          <div className="h-2/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/BIZ.jpg"
              alt="Business Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  Business Related Books/Resources
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-1/3 flex flex-col space-y-2"
        >
          <div className="h-2/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/LAW.png"
              alt="Law Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  Law Related Books/Resources
                </p>
              </div>
            </div>
          </div>
          <div className="h-1/3 overflow-hidden rounded-xl relative group shadow-lg">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src="/images/ARC.jpg"
              alt="Architectural Books"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-orange-800 bg-opacity-85 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out flex items-center justify-center">
                <p className="text-white text-center px-4 text-2xl font-semibold drop-shadow-lg">
                  Architectural Innovations
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MasonryImageGrid;
