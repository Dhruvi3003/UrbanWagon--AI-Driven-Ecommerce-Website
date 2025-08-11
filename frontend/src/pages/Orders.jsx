import React from "react";
// import Nav from '../component/Nav'
import Sidebar from "../component/Sidebar";
import { useState } from "react";
import { useContext } from "react";
// import { authDataContext } from '../context/AuthContextAdmin'
import axios from "axios";
import { useEffect } from "react";
import { SiEbox } from "react-icons/si";
import NavAdmin from "../component/NavAdmin";

function Orders() {
  let [orders, setOrders] = useState([]);
  let serverUrl = "http://127.0.0.1:8000";
  let delivery_fee = 40; // Add this line at the top of the Orders function

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token from Orders:", token);

      const result = await axios.get(serverUrl + "/api/orders/all/", {
        withCredentials: true,
      });
      console.log("data:", result.data);
      setOrders(result.data.reverse());
      // console.log(orders)
    } catch (error) {
      console.log(error);
    }
  };
  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(
        serverUrl + "/api/orders/status/",
        { orderId, status: e.target.value },
        { withCredentials: true }
      );
      if (result.data) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add delete handler
  const deleteOrderHandler = async (orderId) => {
    try {
      await axios.delete(serverUrl + `/api/orders/${orderId}/delete/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      await fetchAllOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);
  return (
    <div className="w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white]">
      <NavAdmin />
      <Sidebar />
      <div className="w-[100%] h-[100%] flex items-center lg:justify-start justify-center">
        <div className="lg:w-[85%] md:w-[70%] h-[100%] lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]">
          <div className="w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white">
            All Orders List
          </div>
          {console.log("Orders:", orders)}

          {orders.map((order, index) => (
            <div
              key={index}
              className="w-[90%] h-[40%] bg-slate-600 rounded-xl flex lg:items-center items-start justify-between  flex-col lg:flex-row p-[10px] md:px-[20px]  gap-[20px]"
            >
              <SiEbox className="w-[60px] h-[60px] text-[black] p-[5px] rounded-lg bg-[white]" />

              <div>
                <div className="flex items-start justify-center flex-col gap-[5px] text-[16px] text-[#56dbfc]">
                  {order.items.map((item, index) => {
                    // console.log("Orderssssssss",item);

                    const name = (item.product.name || "Unnamed").toUpperCase();
                    // console.log(name);
                    const quantity = item?.quantity || 0;
                    const size = item.product.size || "";

                    const line = `${name} * ${quantity} ${
                      size ? `(${size})` : ""
                    }`;

                    return (
                      <p key={index}>
                        {line}
                        {index !== order.items.length - 1 ? "," : ""}
                      </p>
                    );
                  })}
                </div>

                <div className="text-[15px] text-green-100">
                  <p>
                    {(() => {
                      const capitalize = (str) => {
                        return str
                          ? str.charAt(0).toUpperCase() +
                              str.slice(1).toLowerCase()
                          : "";
                      };

                      let parsedAddress = {};
                      try {
                        parsedAddress = JSON.parse(
                          order.address.replace(/'/g, '"')
                        );
                      } catch (e) {
                        console.log("Address parse error:", e);
                      }

                      return (
                        <div className="text-[15px] text-green-100">
                          <p>
                            User: {capitalize(parsedAddress.firstName)}{" "}
                            {capitalize(parsedAddress.lastName)}
                          </p>
                          <p>Email: {parsedAddress.email}</p>
                          <p>Phone: {parsedAddress.phone}</p>
                          <p>Street: {capitalize(parsedAddress.street)}</p>
                          <p>City: {capitalize(parsedAddress.city)}</p>
                          <p>State: {parsedAddress.state}</p>
                          <p>Pin: {parsedAddress.pinCode}</p>
                          <p>Country: {parsedAddress.country}</p>
                        </div>
                      );
                    })()}
                  </p>
                </div>
              </div>
              <div className="text-[15px] text-green-100">
                <p>Items : {order.items.length}</p>
                <p>Method : {order.payment_method}</p>
                <p>Payment : {order.payment_verified ? "Done" : "Pending"}</p>
                <p>Date : {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-[20px] text-[white]">
                  {" "}
                  ₹ {Number(order.total_amount) + delivery_fee}
                </p>
              </div>
              <select
                value={order.status}
                className="px-[5px] py-[10px] bg-slate-500 rounded-lg border-[1px] border-[#96eef3]"
                onChange={(e) => statusHandler(e, order.id)}
              >
                <option value="placed">Order Placed</option>
                <option value="packing">Packing</option>
                <option value="shipped">Shipped</option>
                <option value="out_of_delievery">Out for delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
              {/* Add Delete Button */}
              <button
                className="px-[10px] py-[8px] bg-red-500 text-white rounded-lg ml-[10px] mt-[10px] hover:bg-red-700"
                onClick={() => deleteOrderHandler(order.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
