// src/main.jsx
import './styles/home.css';   // probably already present
import './scripts/homeFunctions.js';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/home.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
