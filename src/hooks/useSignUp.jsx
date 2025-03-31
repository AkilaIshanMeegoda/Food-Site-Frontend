import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate=useNavigate()

  const signUp = async (email, password,role) => {
    setIsLoading(true);
    setError(null);
    const showSuccess = () => {
      toast.success('Successfully Login!',{
        position: "bottom-right",
        theme: "colored",
      });
    };

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password ,role}),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
        navigate("/")
        showSuccess()
      
      
    }
  };
  return { signUp, isLoading, error };
};
