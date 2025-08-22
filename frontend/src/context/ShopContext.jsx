import React, { createContext, useContext, useEffect, useState } from "react";
// import { authDataContext } from "./authContext";

import axios from "axios";
import { userDataContext } from "./UserContext";
// import { userDataContext } from './UserContext'
import api from "../utils/api"; // Adjust the import path as necessary
export const shopDataContext = createContext();
function ShopContext({ children }) {
  let [products, setProducts] = useState([]);
  let [search, setSearch] = useState("");
  let { userData } = useContext(userDataContext);
  let [showSearch, setShowSearch] = useState(false);
  let serverUrl = "http://127.0.0.1:8000";
  let [cartItem, setCartItem] = useState([]);
  //   let [loading,setLoading] = useState(false)
  let currency = "₹";
  let delivery_fee = 40;
  const getProducts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/products/`);
      console.log(res.data);

      setProducts(res.data); // Adjust based on your API's response format
    } catch (err) {
      console.log("Failed to fetch products:", err);
    }
  };
  const addtoCart = async (product, size) => {
    if (!size) {
      console.log("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItem); // Clone the product
    setCartItem(cartData);
    if (userData) {
      // setLoading(true)
      try {
        console.log("product size: ",product,size);
        
        let result = await axios.post(
          serverUrl + "/api/cart/",
          { product, quantity: 1, size },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("add cart response: ", result.data);
        
        if(result.status===201){
          getUserCart();
        }
        console.log(result.data);
      } catch (error) {
        console.log(error);
        // setLoading(false)
        // toast.error("Add Cart Error")
      }
    }
  };
  const getUserCart = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/cart/", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Cart:", result.data);

      setCartItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateQuantity = async (id, size, quantity) => {
    

    if (userData) {
      try {
        console.log("Updating qty: ", id, quantity);

        const response = await axios.put(
          // serverUrl + "/api/cart/" + itemId + "/",
          `${serverUrl}/api/cart/${id}/`,
          { quantity },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if(response.status === 200){
          getUserCart()
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getCartCount = () => {
    return cartItem.length;
  };

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(
        // serverUrl + "/api/cart/" + itemId + "/",
        `${serverUrl}/api/cart/${id}/`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.status === 204) {
        const newCart = cartItem.filter((i) => i["id"] != id);
        setCartItem(newCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items of cartItem) {
      totalAmount += items.total_price;
    }
    return totalAmount;
  };
  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    getUserCart();
  }, []);

  let value = {
    products,
    currency,
    delivery_fee,
    getProducts,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    addtoCart,
    cartItem,
    setCartItem,
    getCartCount,
    updateQuantity,
    getCartAmount,
    deleteItem,
  };
  return (
    <div>
      <shopDataContext.Provider value={value}>
        {children}
      </shopDataContext.Provider>
    </div>
  );
}

export default ShopContext;
