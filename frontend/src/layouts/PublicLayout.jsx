import {
  Outlet,
  useLocation
} from "react-router-dom";

import Navbar
  from "../components/Navbar";

function PublicLayout() {

  const location =
    useLocation();

  // HIDE NAVBAR
  // ON LOGIN/REGISTER

  const hideNavbar =

    location.pathname ===
      "/login" ||

    location.pathname ===
      "/register";

  return (

    <>

      {!hideNavbar && (
        <Navbar />
      )}

      <Outlet />

    </>
  );
}

export default PublicLayout;