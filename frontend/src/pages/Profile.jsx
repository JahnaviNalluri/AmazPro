import { useEffect, useState } from "react";
import API from "../api/axios";
import Header from "./Header";
import "../styles/profile.css";
function Profile() {
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    
      

      <div className="container">
        <h2>Profile</h2>

        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneno}</p>
        <p><strong>Address:</strong> {profile.address}</p>
      </div>
    
  );
}

export default Profile;