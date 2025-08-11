import React from "react";
import Title from "../component/Title";
import { useState } from "react";
import CartTotal from "../component/CartTotal";
import razorpay from "../assets/Razorpay.jpg";
import { shopDataContext } from "../context/ShopContext";
// import { authDataContext } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

function PlaceOrder() {
  let [method, setMethod] = useState("cod");
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products} =
    useContext(shopDataContext);
  let serverUrl = "http://127.0.0.1:8000";
  let [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const initPay = async (order) => {
    await loadRazorpayScript();
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID?.replace(/"/g, ""), // Remove quotes if present
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(
            serverUrl + "/api/orders/verifyrazorpay/",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (verifyRes.data.status === "Payment verified") {
            // After payment is verified, create the order in backend
            const orderItems = cartItem
              .filter((item) => item.quantity > 0 && item.product && item.product.id)
              .map((item) => ({
                product: item.product.id,
                size: item.size,
                quantity: item.quantity,
              }));
            const orderData = {
              address: formData,
              items: orderItems,
              amount: getCartAmount() + delivery_fee,
              currency: "INR",
              payment_method: "razorpay",
              payment_verified: true, // <-- set this flag
            };
            const result = await axios.post(
              serverUrl + "/api/orders/",
              orderData,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              }
            );
            if (result.data) {
              setCartItem([]);
              localStorage.removeItem("cart");
              await clearBackendCart(); // <-- clear backend cart
              toast.success("Order Placed");
              navigate("/order");
            } else {
              toast.error("Order Placed Error");
            }
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          toast.error("Payment verification error");
        }
      },
      prefill: {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#3399cc" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const orderItems = cartItem
        .filter((item) => item.quantity > 0 && item.product && item.product.id)
        .map((item) => ({
          product: item.product.id,
          size: item.size,
          quantity: item.quantity,
        }));

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        currency: "INR",
        payment_method: method,
      };

      switch (method) {
        case "cod":
          console.log("Making API request to create order...");
          const result = await axios.post(
            serverUrl + "/api/orders/",
            orderData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          console.log("result",result.data);
          if (result.data) {
            setCartItem([]);
            localStorage.removeItem("cart");
            await clearBackendCart(); // <-- clear backend cart
            toast.success("Order Placed");
            navigate("/order");
            setLoading(false);
          } else {
            console.log(result.data.message);
            toast.error("Order Placed Error");
            setLoading(false);
          }
          break;

        case "razorpay":
          // 1. Create backend Razorpay order
          const resultRazorpay = await axios.post(
            serverUrl + "/api/orders/razorpay/",
            {
              amount: getCartAmount() + delivery_fee,
              currency: "INR",
              receipt: "order_rcptid_" + Date.now(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (resultRazorpay.data) {
            await initPay(resultRazorpay.data);
            toast.success("Proceeding to Razorpay");
            setLoading(false);
          }
          return;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error("Order Failed");
      // setLoading(false);
    }
    finally{
      setLoading(false);
    }

  };
  // Add this function inside PlaceOrder
  const clearBackendCart = async () => {
    try {
      await axios.delete(serverUrl + "/api/cart/clear/", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      // Optionally handle error
    }
  };
  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px]  relative">
      <div className="lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center  lg:mt-[0px] mt-[90px] ">
        <form
          onSubmit={onSubmitHandler}
          className="lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]"
        >
          <div className="py-[10px]">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="text"
              placeholder="First name"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] shadow-sm shadow-[#343434]"
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
            />

            <input
              type="text"
              placeholder="Last name"
              className="w-[48%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
            />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="email"
              placeholder="Email address"
              className="w-[100%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
            />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="text"
              placeholder="Street"
              className="w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
            />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="text"
              placeholder="City"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
            />
            <input
              type="text"
              placeholder="State"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
            />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="text"
              placeholder="Pincode"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="pinCode"
              value={formData.pinCode}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
            />
          </div>
          <div className="w-[100%] h-[70px] flex items-center justify-between px-[10px]">
            <input
              type="text"
              placeholder="Phone"
              className="w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[18%] bottom-[5%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px]"
            >
              {loading ? (
                <RingLoader color="#141414" size={32} />
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px] ">
        <div className="lg:w-[70%] w-[90%] lg:h-[70%] h-[100%]  flex items-center justify-center gap-[10px] flex-col">
          <CartTotal />
          <div className="py-[10px]">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>
          <div className="w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]">
            <button
              onClick={() => setMethod("razorpay")}
              className={`w-[150px] h-[50px] rounded-sm  ${
                method === "razorpay"
                  ? "border-[5px] border-blue-900 rounded-sm"
                  : ""
              }`}
            >
              {" "}
              <img
                src={razorpay}
                className="w-[100%] h-[100%] object-fill rounded-sm "
                alt=""
              />
            </button>
            <button
              onClick={() => setMethod("cod")}
              className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold ${
                method === "cod"
                  ? "border-[5px] border-blue-900 rounded-sm"
                  : ""
              }`}
            >
              CASH ON DELIVERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
