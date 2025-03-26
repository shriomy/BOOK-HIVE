import React from "react";
import { motion } from "framer-motion";

export default function TeachersSection() {
  const teachers = [
    {
      name: "Angela T. Vigil",
      role: "Associate Professor",
      image: "/images/teacher1.png",
    },
    {
      name: "Frank A. Mitchell",
      role: "Associate Professor",
      image: "/images/teacher2.png",
    },
    {
      name: "Susan D. Lunsford",
      role: "CEO & Founder",
      image: "/images/teacher3.png",
    },
    {
      name: "Dennis A. Pruitt",
      role: "Associate Professor",
      image: "/images/teacher4.png",
    },
  ];

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
    <div className="py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center text-[#2c1f19] mb-4"
      >
        Meet With Our <span className="text-[#edab3b]">Teachers</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center text-gray-500 max-w-2xl mx-auto px-4 text-lg mb-12"
      >
        You can contact them regarding the subject matters in the Library or
        Online. Our experienced educators are dedicated to supporting your
        academic journey.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-8 px-8 py-10"
      >
        {teachers.map((teacher, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white shadow-xl p-10 rounded-3xl text-center transform transition-all duration-500 hover:-translate-y-4 relative overflow-hidden group w-80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out opacity-0 group-hover:opacity-100"></div>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              src={teacher.image}
              alt={teacher.name}
              className="relative z-10 w-full h-64 object-cover rounded-lg mb-6 transition-transform group-hover:scale-105"
            />

            <h3 className="relative z-10 font-bold text-gray-900 text-2xl mb-4 transition-colors group-hover:text-white">
              {teacher.name}
            </h3>
            <p className="relative z-10 text-gray-600 text-lg transition-colors group-hover:text-white/90">
              {teacher.role}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
