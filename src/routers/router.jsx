import {createBrowserRouter} from "react-router-dom";
import Home from "../components/home/Home";
import App from "../App";

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
          }
        ]
      },
  
    ]);
  }
  export default CreateRouter;