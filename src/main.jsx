import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="859054408017-vvmqcdn72gm88jjvh7akrqopkp0k5jo1.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
