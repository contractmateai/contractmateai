import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/home.css"; // or your main CSS file
import "./styles/CookieConsent.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);