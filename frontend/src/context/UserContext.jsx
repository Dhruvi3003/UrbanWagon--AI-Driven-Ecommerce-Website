import React, { createContext, useContext, useEffect, useState } from "react";
// import { authDataContext } from "./authContext";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  let [userData, setUserData] = useState("");
  let  serverUrl  = "http://127.0.0.1:8000"

  const getCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      let result = await axios.get(
        "http://127.0.0.1:8000/api/accounts/getcurrentuser/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  let value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
