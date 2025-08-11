import React from "react";
import Logo from "../assets/BrandLogo-removebg-preview.png";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import { useContext } from "react";
import { authDataContext } from "../../../frontend/src/context/AuthContextAdmin";
import axios from "axios";
import { adminDataContext } from "../../../frontend/src/context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
function Login() {
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let {adminData , getAdmin} = useContext(adminDataContext)
  let navigate = useNavigate()
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const AdminLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );
      console.log(result.data);
      toast.success("Admin Login Successfully");
      getAdmin();
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Admin Login Failed");
      setLoading(false);
    }
  };
  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start">
      <div className="w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer">
        <img src={Logo} alt="" className="w-[60px] bg-transparent" />
        <h1 className="text-[22px] font-sans">UrbanWagon</h1>
      </div>

      <div className="w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[25px] font-semibold">Login Page</span>
        <span className="text-[16px]">
          Welcome to UrbanWagon, Apply to Admin Login !!
        </span>
      </div>

      <div className="max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        {/* Registration Form */}
        <form
          onSubmit={AdminLogin}
          action=""
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
        >
          <div className="w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative">
            <input
              type="email"
              className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Email"
              required
              onChange={handleEmailChange}
              value={email}
            />
            <input
              type={show ? "text" : "password"}
              className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
              placeholder="Password"
              required
              onChange={handlePasswordChange}
              value={password}
              autoComplete="current-password"
            />

            {!show && (
              <IoEyeOutline
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[50%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}

            {show && (
              <IoEye
                className="w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[50%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
            <button className="w-[100%] h-[50px] bg-[#5555f6cf] rounded-lg flex items-center justify-center mt-[20px] text-[17px font-semibold cursor-pointer">
              {loading ? <RingLoader color="#141414" size={32} /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
