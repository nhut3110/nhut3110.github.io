import React from "react";
import { useState } from "react";
import images from "../../constants/images";
import "../Navbar/NavBar.css";
// import "../style.css";
// import { Link } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="n-wrapper px-10" id="Navbar">
      {/* left */}
      <div className="n-left">
        <div className="n-name">Taskey</div>
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
              <Link to="/login" spy={true} smooth={true}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" spy={true} smooth={true}>
                <button className="button n-button">Signup</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
