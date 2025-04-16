import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const useLogin = () => {
  const showSuccess = () => {
    toast.success("Successfully logged in!", {
      position: "bottom-right",
      theme: "colored",
    });
  };
  
  const showPendingApproval = () => {
    toast.warning("Your restaurant is pending admin approval", {
      position: "bottom-right",
      theme: "colored",
    });
  };
  
  const showError = (message = "Check your email & password!") => {
    toast.error(message, {
      position: "bottom-right",
      theme: "colored",
    });
  };

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate user
      const authResponse = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const authData = await authResponse.json();

      if (!authResponse.ok) {
        showError(authData.error);
        setIsLoading(false);
        setError(authData.error);
        return;
      }

      // Step 2: For restaurant admins, fetch restaurant details
      if (authData.role === "restaurant_admin") {
        const restaurantResponse = await fetch("http://localhost:5001/api/restaurants/my-restaurant", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authData.token}`
          }
        });

        const restaurantData = await restaurantResponse.json();

        if (!restaurantResponse.ok) {
          showError("Failed to fetch restaurant details");
          setIsLoading(false);
          setError("Failed to fetch restaurant details");
          return;
        }

        // Step 3: Check restaurant active status
        if (!restaurantData.isActive) {
          showPendingApproval();
          setIsLoading(false);
          setError("Restaurant account pending approval");
          // Clear any stored auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        // Merge restaurant data with auth data
        authData.restaurant = restaurantData;
      }

      // Step 4: Complete login process
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData));
      dispatch({ type: "LOGIN", payload: authData });
      setIsLoading(false);

      // Redirect based on role
      switch(authData.role) {
        case "customer":
          navigate("/");
          break;
        case "restaurant_admin":
          navigate("/restaurant_admin/dashboard/home");
          break;
        case "delivery_personnel":
          navigate("/delivery/dashboard/home");
          break;
        case "super_admin":
          navigate("/super_admin/dashboard/home");
          break;
        default:
          navigate("/");
      }
      showSuccess();

    } catch (error) {
      console.error("Login error:", error);
      showError("An unexpected error occurred");
      setIsLoading(false);
      setError("An unexpected error occurred");
      // Clear any partial auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return { login, isLoading, error };
};