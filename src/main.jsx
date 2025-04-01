import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import React from "react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify"
import CreateRouter  from "./routers/router";

const router = CreateRouter();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <ToastContainer/>
    </AuthContextProvider>
  </React.StrictMode>
)
