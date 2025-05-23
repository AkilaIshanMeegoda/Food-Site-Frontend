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
      toast.success('Successfully Sign Up. Please Login!',{
        position: "bottom-right",
        theme: "colored",
      });
    };

    const response = await fetch("http://localhost:8000/userApi/user/register", {
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
      setIsLoading(false);
        navigate("/login")
        showSuccess()
      
      
    }
  };
  return { signUp, isLoading, error };
};
