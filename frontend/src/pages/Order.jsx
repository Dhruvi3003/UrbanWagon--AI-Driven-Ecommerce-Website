import React, { useContext, useEffect, useState } from "react";
import Title from "../component/Title";
import { shopDataContext } from "../context/ShopContext";
// import { authDataContext } from '../context/authContext'
import axios from "axios";

function Order() {
  let [orderData, setOrderData] = useState([]);
  let { currency } = useContext(shopDataContext);
  let serverUrl = "http://127.0.0.1:8000";

  const loadOrderData = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/orders/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Order Data:", result.data);
      
      if (result.data) {
        let allOrdersItem = [];
        result.data.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            item["payment"] = order.payment || "Not Paid";
            // Capitalize whole payment method
            item["paymentMethod"] = order.payment_method ? order.payment_method.toUpperCase() : "";
            item["date"] = order.created_at.slice(0, 10);
            allOrdersItem.push(item);
            console.log("Order Item:", item);
            
          });
        });
        console.log("All Orders Item:", allOrdersItem);
        
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="w-[99vw] min-h-[100vh] p-[20px] pb-[150px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025] ">
      <div className="h-[8%] w-[100%] text-center mt-[80px]">
        <Title text1={"MY"} text2={"ORDER"} />
      </div>
      {/* Common Track All Orders Button */}
      <div className="w-full flex justify-end mb-8">
        <button
          className="px-[18px] py-[8px] rounded-md bg-[#101919] text-[#f3f9fc] text-[15px] md:text-[18px] font-semibold active:bg-slate-500 transition"
          onClick={loadOrderData}
        >
          Track All Orders
        </button>
      </div>
      <div className="w-[100%] h-[92%] flex flex-wrap gap-[20px]">
        {console.log("Order Data:", orderData)}
        
        {orderData.map((item, index) => (
          <div key={index} className="w-full border-t border-b">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-[#51808048] py-[10px] px-[10px] md:px-[20px] rounded-2xl relative">
              <img
                src={
                  item.product.variants && item.product.variants[0].image1
                    ? `${serverUrl}${item.product.variants[0].image1}`
                    : ""
                }
                alt=""
                className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-md object-cover"
              />
              <div className="flex-1 flex flex-col gap-[5px]">
                <p className="md:text-[25px] text-[18px] text-[#f3f9fc] font-bold">
                  {item.product.name}
                </p>
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <p className="md:text-[18px] text-[12px] text-[#aaf4e7]">
                    {currency} {item.price}
                  </p>
                  <p className="md:text-[18px] text-[12px] text-[#aaf4e7]">
                    Quantity: 
                    <span className="text-[#e4fbff] pl-[10px] md:text-[16px] text-[11px]">
                      {item.quantity}
                    </span>
                  </p>
                  <p className="md:text-[18px] text-[12px] text-[#aaf4e7]">
                    Size: 
                    <span className="text-[#e4fbff] pl-[10px] md:text-[16px] text-[11px]">
                      {item.size}
                    </span>
                    
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="md:text-[18px] text-[12px] text-[#aaf4e7]">
                    Date:{" "}
                    <span className="text-[#e4fbff] pl-[10px] md:text-[16px] text-[11px]">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="md:text-[16px] text-[12px] text-[#aaf4e7]">
                    Payment Method: 
                    <span className="text-[#e4fbff] pl-[10px] md:text-[16px] text-[11px]">
                      {item.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>
              {/* Status on right for all screens */}
              <div className="flex flex-col items-end justify-between min-w-[90px] md:min-w-[120px] h-full self-stretch pt-2 md:pt-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-yellow-400"
                    }`}
                  ></span>
                  <span className="md:text-[17px] text-[12px] text-[#f3f9fc] font-semibold">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
