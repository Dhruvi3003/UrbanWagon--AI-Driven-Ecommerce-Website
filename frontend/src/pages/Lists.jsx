import React, { useContext, useEffect, useState } from "react";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
// import { authDataContext } from '../context/AuthContextAdmin'
import axios from "axios";
import NavAdmin from "../component/NavAdmin";
import { useNavigate } from "react-router-dom";

function Lists() {
  let [list, setList] = useState([]);
  let serverUrl = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/products/");
      setList(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeList = async (id) => {
    try {
      let result = await axios.post(
        `${serverUrl}/api/products/remove/${id}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (result.data) {
        fetchList();
      } else {
        console.log("Failed to remove Product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] overflow-x-hidden relative">
      <NavAdmin />
      <Sidebar />
      <div className="w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0 bottom-[5%]">
        <div className="w-[100%] md:w-[90%] h-[100%] mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]">
          <div className="w-[400px] h-[50px] text-[25px] md:text-[40px] text-white mb-[20px]">
            All Listed Products
          </div>
          {list?.length > 0 ? (
            list.map((item, index) => (
              <div
                className="w-[90%] min-h-[90px] md:min-h-[120px] bg-slate-600 rounded-xl flex items-center justify-start gap-[5px] md:gap-[30px] p-[10px] md:px-[30px]"
                key={index}
              >
                <img
                  src={`${serverUrl}/${item.variants[0].image1}`}
                  className="w-[30%] md:w-[120px] h-[90%] rounded-lg"
                  alt=""
                />
                <div className="w-[90%] h-[80%] flex flex-col items-start justify-center gap-[2px]">
                  <div className="w-[100%] md:text-[20px] text-[15px] text-[#bef0f3]">
                    {item.name}
                  </div>
                  <div className="md:text-[17px] text-[15px] text-[#bef3da]">
                    {item.category}
                  </div>
                  <div className="md:text-[17px] text-[15px] text-[#bef3da]">
                    ₹{item.price}
                  </div>
                  {/* <div>
                    {item.variants.map((i)=>(
                      <p>{i.size}</p>
                    ))}
                  </div> */}
                </div>
                <div className="w-[10%] h-[100%] bg-transparent flex flex-col items-center justify-center gap-2">
                  <span
                    className="w-[35px] h-[30%] flex items-center justify-center rounded-md md:hover:bg-red-300 md:hover:text-black cursor-pointer"
                    onClick={() => removeList(item.id)}
                  >
                    X
                  </span>
                  <button
                    className="w-[60px] h-[30px] mt-2 bg-blue-400 text-black rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
                    onClick={() => {
                      localStorage.setItem("editProduct", JSON.stringify(item));
                      navigate(`/add`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-lg">No products available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lists;
