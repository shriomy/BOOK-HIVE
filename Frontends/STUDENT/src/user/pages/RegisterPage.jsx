import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import CustomAlert from "../components/CustomAlert"; // Import our custom alert component

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idnumber, setidnumber] = useState("");
  const [faculty, setFaculty] = useState(""); // New state for faculty
  const [idcard, setidcard] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [idcardPreview, setIdcardPreview] = useState(null);

  // New alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const navigate = useNavigate();

  // Faculty options
  const facultyOptions = [
    "Faculty of Computing",
    "Engineering Faculty",
    "Faculty of Humanities and Sciences",
    "Business Faculty",
    "Law Faculty",
    "School of Architecture",
  ];

  async function registerUser(ev) {
    ev.preventDefault();

    // Additional validation for faculty
    if (!faculty) {
      setAlertMessage("Please select your faculty.");
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }

    if (!idcard) {
      setAlertMessage("Please upload your ID card.");
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("idnumber", idnumber);
    formData.append("faculty", faculty); // Add faculty to form data
    formData.append("idcard", idcard);

    try {
      // Register user and send OTP
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Show success alert instead of JavaScript alert
      setAlertMessage(response.data.message);
      setAlertVariant("success");
      setShowAlert(true);

      // Store userId for OTP verification
      localStorage.setItem("userId", response.data.userId);
      console.log("Stored userId:", response.data.userId);

      // Navigate to OTP page after short delay (to allow user to see the message)
      setTimeout(() => {
        console.log("Navigating to OTP page...");
        navigate("/verify-otp");
      }, 2000);
    } catch (e) {
      // Show error alert
      setAlertMessage(
        "Registration failed! " +
          (e.response?.data?.message || "Please try again.")
      );
      setAlertVariant("danger");
      setShowAlert(true);
    }
  }

  const handleFileChange = (ev) => {
    const file = ev.target.files[0];
    setidcard(file);

    // Create a preview of the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdcardPreview(reader.result); // Set the preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% h-screen overflow-hidden relative">
        {/* Video background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
        >
          <source src="/images/library.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Your content */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden gap-20 z-10 relative">
          {/* Left Side - Registration Form */}
          <div className="mb-30 mt-15 p-10 flex flex-col justify-center bg-[#362927] bg-opacity-70 backdrop-blur-md rounded-2xl shadow-xl max-w-lg mx-auto">
            <h1 className="text-4xl text-center text-white font-bold">
              Register
            </h1>

            {/* Custom Alert Component */}
            <CustomAlert
              show={showAlert}
              variant={alertVariant}
              message={alertMessage}
              onClose={() => setShowAlert(false)}
            />

            <form className="mt-6 space-y-5" onSubmit={registerUser}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                />

                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="IT22****"
                  value={idnumber}
                  onChange={(ev) => setidnumber(ev.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                />

                {/* New Faculty Dropdown */}
                <select
                  value={faculty}
                  onChange={(ev) => setFaculty(ev.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                >
                  <option value="">Select Your Faculty</option>
                  {facultyOptions.map((fac) => (
                    <option key={fac} value={fac} className="bg-[#4a3936]">
                      {fac}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-white bg-transparent border-none p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-white mb-2 text-lg font-medium">
                  Upload ID Card
                </label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex items-center justify-center w-full bg-[#edbf6d] text-black hover:bg-[#d9a856] p-3 rounded-2xl cursor-pointer font-medium shadow-md transition-all"
                  >
                    Choose File
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5m-6-4.5L12 21m0 0L9 12m3 9V3"
                      />
                    </svg>
                  </label>
                </div>

                {/* Preview the uploaded image */}
                {idcardPreview && (
                  <div className="mt-4 text-center">
                    <img
                      src={idcardPreview}
                      alt="ID Card Preview"
                      className="w-40 h-40 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button className="primary">Register</button>

              <div className="text-center text-white mt-4">
                Already have an account?{" "}
                <Link
                  className="underline text-[#edbf6d] hover:text-white transition-all"
                  to="/login"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>

          {/* Right Side - Brand Name */}
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
}
