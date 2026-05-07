import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
// import {Navbar} from "../components/Navbar";
function CustomerLayout() {
  return (
    <>
      
      <Outlet />
    </>
  );
}

export default VendorLayout;