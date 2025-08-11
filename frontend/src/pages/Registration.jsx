import React, { useContext, useState } from "react";
import Logo from "../assets/BrandLogo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.jpg";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
// import { authDataContext } from "../context/authContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
function Registration() {
  let [show, setShow] = useState(false);
  let serverUrl = "http://127.0.0.1:8000";
  let navigate = useNavigate();
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  // const [role, setRole] = useState(""); // default value
  let [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let { userdata, getCurrentUser } = useContext(userDataContext);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/accounts/register/`,
        {
          name,
          email,
          password,
          role: "customer",
        },
        {
          withCredentials: true,
        }
      );

      // getCurrentUser(); // If your context fetches current user
      navigate("/");
      toast.success("Registration Successful");
      setLoading(false);
      console.log(result.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Registration Failed");
      setLoading(false);
    }
  };

  const googleSignup = async (e) => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(
        serverUrl + "/api/accounts/register/",
        { name, email, password: user.uid, role: "customer" }, // use uid as password or handle as needed
        {withCredentials: true}
      );
      // Optionally, auto-login after registration
      // Save tokens if returned, or redirect to login
      toast.success("Registration Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Google Registration Failed");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start">
      <div
        className="w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={Logo} alt="" className="w-[60px] bg-transparent" />
        <h1 className="text-[22px] font-sans">UrbanWagon</h1>
      </div>

      <div className="w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[25px] font-semibold">Registration Page</span>
        <span className="text-[16px]">
          Welcome to UrbanWagon, Place your order!!
        </span>
      </div>

      <div className="max-w-[600px] w-[90%] h-[600px] mb-[30px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        {/* Registration Form */}
        <form
          onSubmit={handleSignup}
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
        >
          <div
            className="w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer"
            onClick={googleSignup}
          >
            <img src={google} alt="" className="w-[20px] rounded-full" />
            Register with Google
          </div>

          <div className="w-[100%] h-[20px] flex items-center justify-center gap-[10px]">
            <div className="w-[40%] h-[1px] bg-[#96969635]"></div> OR{" "}
            <div className="w-[40%] h-[1px] bg-[#96969635]"></div>
          </div>

          <div className="w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative">
            {/* Username */}
            <input
              type="text"
              className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Username"
              required
              onChange={handleNameChange}
              value={name}
            />

            {/* Email */}
            <input
              type="email"
              className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Email"
              required
              onChange={handleEmailChange}
              value={email}
            />

            {/* Password */}
            <div className="relative w-[100%]">
              <input
                type={show ? "text" : "password"}
                className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
                placeholder="Password"
                required
                onChange={handlePasswordChange}
                value={password}
              />
              {show ? (
                <IoEye
                  className="w-[20px] h-[20px] cursor-pointer absolute right-[15px] top-[15px]"
                  onClick={() => setShow((prev) => !prev)}
                />
              ) : (
                <IoEyeOutline
                  className="w-[20px] h-[20px] cursor-pointer absolute right-[15px] top-[15px]"
                  onClick={() => setShow((prev) => !prev)}
                />
              )}
            </div>

            {/* Submit Button */}
            <button className="w-[100%] h-[50px] bg-[#5555f6cf] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold">
              {loading ? (
                <RingLoader color="#141414" size={32} />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Redirect to Login */}
            <p className="flex gap-[10px]">
              Already have an account?
              <span
                className="text-[#5555f6cf] text-[17px] font-semibold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
