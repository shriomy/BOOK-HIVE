import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (data.token) {
        // Save the token in localStorage or sessionStorage
        localStorage.setItem("token", data.token);

        // Optionally, store user data in state
        // setUser(data.user);

        alert("Login successful");

        // Redirect to another page after successful login
        navigate("/"); // Change the route as needed
      } else {
        alert("Login failed");
      }
    } catch (e) {
      alert("Login failed");
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% h-screen overflow-hidden relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="images/library.mp4" type="video/mp4" />
      </video>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden gap-20 z-10 relative">
        {/* Left Side - Login Form */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <div className="bg-[#362927] bg-opacity-70 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-white text-2xl font-bold text-center mb-4">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-white font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#edbf6d] text-black hover:bg-[#d9a856] p-2 w-full rounded-2xl font-semibold"
              >
                Login
              </button>
            </form>
            <p className="text-center text-sm text-white mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#edbf6d]">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Brand Name */}
        <div className="relative flex-1 hidden lg:flex items-center justify-center">
          <div className="w-full h-full flex justify-center items-center text-white">
            <h1 className="text-6xl font-bold text-center mb-12">BOOK</h1>
            <span className="italic text-4xl">hive</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#edbf6d"
                className="size-20"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
