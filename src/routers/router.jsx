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
import UpdateItem from "../pages/restaurant_admin/UpdateItem";
import MenuItems from "../components/menuItems/MenuItems";
import ItemDetails from "../components/menuItems/ItemDetails";
import ViewItemDetails from "../pages/restaurant_admin/ViewItemDetails";
import Restaurants from "../pages/restaurant_admin/Restaurants";
import RestaurantItems from "../pages/restaurant_admin/RestaurantItems";
import CategoryItems from "../pages/restaurant_admin/CategoryItems";
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
          path: "/menuItems",
          element: <MenuItems />,
        },
        {
          path: "/view-menuItem/:id",
          element: <ItemDetails />,
        },
        {
          path: "/restaurants",
          element: <Restaurants />,
        },
        {
          path: "/restaurants-all-items/:id",
          element: <RestaurantItems />,
        },
        {
          path: "/category-items/:category",
          element: <CategoryItems />,
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
