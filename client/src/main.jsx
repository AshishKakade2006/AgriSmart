import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          // Default toast options
          duration: 4000,
          style: { fontSize: "14px" },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
);