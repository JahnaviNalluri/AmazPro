import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneno: "",
    address: "",
    role: "user",
    vendorInfo: {
      storename: "",
      storedesc: ""
    }
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "storename" || name === "storedesc") {
      setForm({
        ...form,
        vendorInfo: {
          ...form.vendorInfo,
          [name]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phoneno"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <select name="role" onChange={handleChange}>
          <option value="user">Register as User</option>
          <option value="vendor">Register as Vendor</option>
        </select>

        {form.role === "vendor" && (
          <>
            <input
              type="text"
              name="storename"
              placeholder="Store Name"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="storedesc"
              placeholder="Store Description"
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
