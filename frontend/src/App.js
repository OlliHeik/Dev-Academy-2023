import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import AddJourney from "./pages/AddJourney";
import Station from "./pages/Station";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.scss";

const Layout = () => {  // Layout for common components (navbar & footer) using react-router-dom Outlet
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  );
};

const router = createBrowserRouter([  // Routes
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/journey/:id",
        element: <Journey/>,
      },
      {
        path: "/journey/add",
        element: <AddJourney/>,
      },
      {
        path: "/station/:id",
        element: <Station/>,
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
      <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
