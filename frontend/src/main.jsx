import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
// import AuthContext from "./context/authContext.jsx";
import UserContext from "./context/UserContext.jsx";
import ShopContext from "./context/ShopContext.jsx";
import AdminContext from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <AuthContext> */}
    <AdminContext>
      <UserContext>
        <ShopContext>
          <App />
        </ShopContext>
      </UserContext>
    </AdminContext>
    {/* </AuthContext> */}
  </BrowserRouter>
);
