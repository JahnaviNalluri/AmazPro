import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
    <>
   
      <Outlet />
    </>
  );
}

export default CustomerLayout;
