import { createBrowserRouter } from "react-router-dom";
import Home from "../components/home/Home";
import App from "../App";
import Login from "../components/landingPage/ClientLogin";
import SignUp from "../components/landingPage/ClientSignUp";
import AdminDashboardLayout from "../pages/restaurant_admin/AdminDashboardLayout";
import Admin_Home from "../pages/restaurant_admin/Admin_Home";
import DeliveryDashboardLayout from "../pages/delivery_personnel/DeliveryDashboardLayout";
import Delivery_Home from "../pages/delivery_personnel/Delivery_Home";
import ManageItems from "../pages/restaurant_admin/ManageItems";
import ManageOrders from "../pages/restaurant_admin/ManageOrders";
import AddItem from "../pages/restaurant_admin/AddItem";
import ViewItemDetails from "../pages/restaurant_admin/ViewItemDetails";
import UpdateItem from "../pages/restaurant_admin/UpdateItem";

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
        { 
          path: "/restaurant_admin/dashboard/manage-items", 
          element: <ManageItems /> 
        },
        { 
          path: "/restaurant_admin/dashboard/manage-orders", 
          element: <ManageOrders /> 
        },
        { 
          path: "/restaurant_admin/dashboard/add-item", 
          element: <AddItem /> 
        },
        { 
          path: "/restaurant_admin/dashboard/view-item/:id", 
          element: <ViewItemDetails /> 
        },
        { 
          path: "/restaurant_admin/dashboard/update-item/:id", 
          element: <UpdateItem /> 
        },
      ],
    },
    {
      path: "/delivery/dashboard",
      element: <DeliveryDashboardLayout />,
      children: [
        { path: "/delivery/dashboard/home", element: <Delivery_Home /> },
      ],
    },
  ]);
}
export default CreateRouter;
