import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
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
import RestaurantSignUp from "../components/landingPage/RestaurantSignUp.jsx";
import SuperAdminDashboardLayout from "../pages/super_admin/SuperAdminDashboardLayout.jsx";
import SuperAdminHome from "../pages/super_admin/SuperAdminHome.jsx";
import Order from "../pages/customer/Order.jsx";
import AboutUs from "../components/home/AboutUs.jsx";
import ContactUs from "../components/home/ContactUs.jsx";
import TrackOrder from "../components/orders/TrackOrder.jsx";
import Join from "../components/home/Join.jsx";


function CreateRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/menuItems", element: <MenuItems /> },
        { path: "/view-menuItem/:id", element: <ItemDetails /> },
        { path: "/restaurants", element: <Restaurants /> },
        { path: "/restaurants-all-items/:id", element: <RestaurantItems /> },
        { path: "/category-items/:category", element: <CategoryItems /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/restaurant-signup", element: <RestaurantSignUp /> },
        { path: "/driver-register", element: <DeliveryRegistrationForm /> },
        { path: "/order", element: <Order /> },
        { path: "/aboutus", element: <AboutUs /> },
        { path: "/contactus", element: <ContactUs /> },
        { path:"/track-order/:orderId", element: <TrackOrder /> },
        { path: "/join", element: <Join /> },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["restaurant_admin"]} />,
      children: [
        {
          path: "/restaurant_admin/dashboard",
          element: <AdminDashboardLayout />,
          children: [
            { path: "home", element: <Admin_Home /> },
            { path: "manage-items", element: <ManageItems /> },
            { path: "manage-orders", element: <ManageOrders /> },
            { path: "add-item", element: <AddItem /> },
            { path: "view-item/:id", element: <ViewItemDetails /> },
            { path: "update-item/:id", element: <UpdateItem /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["super_admin"]} />,
      children: [
        {
          path: "/super_admin/dashboard",
          element: <SuperAdminDashboardLayout />,
          children: [
            { path: "home", element: <SuperAdminHome /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["delivery_personnel"]} />,
      children: [
        {
          path: "/delivery/dashboard",
          element: <DeliveryDashboardLayout />,
          children: [
            { path: "home", element: <Delivery_Home /> },
            { path: "register", element: <DeliveryRegistrationForm /> },
            { path: "my-deliveries", element: <MyDeliveries /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["customer"]} />,
      children: [
        {
          path: "/checkout",
          element: <CheckoutLayout />,
          children: [
            { path: "success", element: <Success /> },
            { path: "cancel", element: <Cancel /> },
          ],
        },
      ],
    },
  ]);
}

export default CreateRouter;