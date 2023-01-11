import React from "react";
import "./ChangeSuccess.css";
// import "../style.css";
import FeatherIcon from "feather-icons-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ChangeSuccess = () => {
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
    <div>
      <div class="success-changed-container">
        <div class="title-container">
          <h1>
            <div class="title-container-border-icon">
              <FeatherIcon class="title-container-icon" icon="smile" />
            </div>
          </h1>
          <h2>Great News! </h2>
          <h3>Changed Password Successfully!</h3>
          <p>Let's go back to login and enjoy with us!</p>
        </div>
        <p class="social-text">
          <button class="reg-btn" onClick={(e) => {}}>
            <Link to="/login">← Back to log in</Link>
          </button>
        </p>
      </div>
    </div>
  );
};

export default ChangeSuccess;
