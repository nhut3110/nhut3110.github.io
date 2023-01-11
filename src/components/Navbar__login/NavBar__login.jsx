import React from "react";
import { useState } from "react";
import images from "../../constants/images";
import "../Navbar/NavBar.css";
// import "../style.css";
// import { Link } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const NavBarLogin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("task-user"));
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    console.log(headers);
    try {
      const res = await axios.delete(
        "https://dev.thanqminh.com:3000/auth/sign_out",
        {
          headers: headers,
        }
      );
      console.log(res);
      localStorage.clear();
      console.log("logout successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="n-wrapper px-10" id="Navbar">
      {/* left */}
      <div className="n-left">
        {/* <Link to="/"> */}
        <div className="n-name">Taskey</div>
        {/* </Link> */}
      </div>
      {/* right */}
      <div className="n-right">
        <div className="n-list">
          <ul style={{ listStyleType: "none" }}>
            <li>
              <Link to="/" spy={true} smooth={true}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/userspace" spy={true} smooth={true}>
                Task List
              </Link>
            </li>
            <li>
              <Link to="/profile" spy={true} smooth={true}>
                <img
                  className="profile__avatar"
                  src="https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG"
                  alt="img"
                />
              </Link>
            </li>
            <li>
              <Link
                className="Logout__text"
                to="/login"
                spy={true}
                smooth={true}
                onClick={handleLogout}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarLogin;
