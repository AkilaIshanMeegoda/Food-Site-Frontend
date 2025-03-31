import {createBrowserRouter} from "react-router-dom";
import Home from "../components/home/Home";
import App from "../App";
import Login from "../components/landingPage/ClientLogin"
import SignUp from "../components/landingPage/ClientSignUp"

function CreateRouter(){
    return createBrowserRouter([
      /*home routes*/
      {
        path: "/",
        element: <App/>,
        children:[
          {
            path:'/',
            element:<Home/>
          },
          {
            path:"/login",
            element:<Login/>
          },
          {
            path:"/signup",
            element:<SignUp/>
          },
        ]
      },
  
    ]);
  }
  export default CreateRouter;