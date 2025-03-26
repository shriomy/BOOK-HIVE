import React, { useRef } from "react";
import { motion } from "framer-motion";
import { BookOpenIcon, GlobeIcon, UsersIcon } from "lucide-react";
import CustomButton from "./CustomButton";

const AboutSection = () => {
  return (
    <div className="bg-white pt-20 mt-2">
      <main className="grid grid-cols-2 gap-12 p-12">
        {/* Left Side - Images Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 grid-rows-2 gap-6"
        >
          <div className="col-span-1 row-span-2">
            <motion.div
              className="w-full h-full bg-cover bg-center rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
              style={{ backgroundImage: `url('/images/book-shelf.jpg')` }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-black bg-opacity-20 hover:bg-opacity-0 w-full h-full transition-all duration-300 rounded-lg"></div>
            </motion.div>
          </div>
          <div className="col-span-1">
            <motion.div
              className="w-full h-full bg-cover bg-center rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
              style={{ backgroundImage: `url('/images/book-shelf.jpg')` }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-black bg-opacity-20 hover:bg-opacity-0 w-full h-full transition-all duration-300 rounded-lg"></div>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((item, index) => (
              <motion.div
                key={item}
                className="bg-cover bg-center rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
                style={{ backgroundImage: `url('/images/book-shelf.jpg')` }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-black bg-opacity-20 hover:bg-opacity-0 w-full h-full transition-all duration-300 rounded-lg"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Text & Features */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-[#2c1f19]">
              <h2 className="text-5xl font-bold mb-6">About Us</h2>
              <h3 className="text-4xl font-bold mb-4">
                Our EduKation System{" "}
                <span className="text-[#edab3b]">Inspires You More.</span>
              </h3>
              <p className="text-gray-600 mb-8">
                There are many variations of passages available but the majority
                have suffered alteration in some form by injected humour
                randomised words which don't look even slightly believable.
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: <BookOpenIcon className="text-orange-500 text-3xl" />,
                title: "EduKation Services",
                desc: "Established content services",
                color: "bg-orange-50",
              },
              {
                icon: <GlobeIcon className="text-green-500 text-3xl" />,
                title: "International Hubs",
                desc: "Global learning networks",
                color: "bg-green-50",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                viewport={{ once: true }}
              >
                <div
                  className={`${item.color} p-6 rounded-lg flex items-center space-x-6`}
                >
                  {item.icon}
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-50 p-6 rounded-lg flex items-center space-x-6 mb-6">
                <UsersIcon className="text-blue-500 text-3xl" />
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">
                    30 Years Of Quality Service
                  </h3>
                  <p className="text-sm text-gray-600">
                    Trusted educational partner
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="flex space-x-6"
          >
            <CustomButton text="Discover More" />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AboutSection;
