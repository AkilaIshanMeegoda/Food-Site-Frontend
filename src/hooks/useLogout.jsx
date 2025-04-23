import { useCart } from "../context/CartContext";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate=useNavigate()
  const { dispatch } = useAuthContext();
  const { clearCart } = useCart();

  const logout = () => {
    localStorage.removeItem("user");
    clearCart();
    dispatch({type:'LOGOUT'})
    navigate('/')
  };

  return {logout}
};
