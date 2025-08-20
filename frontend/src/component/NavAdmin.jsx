import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BrandLogo.png";
import { adminDataContext } from "../context/AdminContext";
import { toast } from "react-toastify";
// import { authDataContext } from "../context/AuthContextAdmin";
import axios from "axios";
function NavAdmin() {
  let navigate = useNavigate();
  let serverUrl = "http://127.0.0.1:8000";
  let { getAdmin } = useContext(adminDataContext);
  const logOut = async () => {
    try {
      await axios.get(serverUrl + "/api/accounts/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // toast.success("Logout Successfully");
      window.location.href = "/login"; 
      toast.success("Logout Successfully");

    } catch (error) {
      toast.error("Logout Failed");
    }
  };
  return (
    <div className="w-[100vw] h-[70px] bg-[#dcdbdbf8] z-10 fixed top-0 flex  items-center justify-between px-[30px] overflow-x-hidden shadow-md shadow-black ">
      <div
        className="w-[30%]  flex items-center justify-start   gap-[10px] cursor-pointer "
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="" className="w-[30px]" />
        <h1 className="text-[25px] text-[black] font-sans ">UrbanWagon</h1>
      </div>
      <button
        className="text-[15px] hover:border-[2px] border-[#89daea] cursor-pointer bg-[#000000ca] py-[10px] px-[20px] rounded-2xl text-white "
        onClick={logOut}
      >
        Logout
      </button>
    </div>
  );
}

export default NavAdmin;
