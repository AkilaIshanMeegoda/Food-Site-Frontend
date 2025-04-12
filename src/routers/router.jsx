import { createBrowserRouter } from "react-router-dom";
import Home from "../components/home/Home";
import App from "../App";
import Login from "../components/landingPage/ClientLogin";
import SignUp from "../components/landingPage/ClientSignUp";
import AdminDashboardLayout from "../pages/restaurant_admin/AdminDashboardLayout";
import Admin_Home from "../pages/restaurant_admin/Admin_Home";
import DeliveryDashboardLayout from "../pages/delivery_personnel/DeliveryDashboardLayout";
import Delivery_Home from "../pages/delivery_personnel/Delivery_Home";
import DeliveryRegistrationForm from "../pages/delivery_personnel/DeliveryRegistrationForm.jsx";
import MyDeliveries from "../pages/delivery_personnel/MyDeliveries.jsx";
import CheckoutLayout from "../pages/checkout/CheckoutLayout";
import Success from "../pages/checkout/SuccessPage";
import Cancel from "../pages/checkout/CancelPage";

function CreateRouter() {
  return createBrowserRouter([
    /*home routes*/
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
      ],
    },
    {
      path: "/restaurant_admin/dashboard",
      element: <AdminDashboardLayout />,
      children: [
        { path: "/restaurant_admin/dashboard/home", element: <Admin_Home /> },
      ],
    },
    {
      path: "/delivery/dashboard",
      element: <DeliveryDashboardLayout />,
      children: [
        { path: "/delivery/dashboard/home", element: <Delivery_Home /> },
        { path: "/delivery/dashboard/register", element: <DeliveryRegistrationForm /> },
        { path: "/delivery/dashboard/my-deliveries", element: <MyDeliveries /> },
      ],
    },
    {
      path: "/checkout",
      element: <CheckoutLayout />,
      children: [
        { path: "/checkout/success", element: <Success /> },
        { path: "/checkout/cancel", element: <Cancel /> },
      ]
    }
  ]);
}
export default CreateRouter;
