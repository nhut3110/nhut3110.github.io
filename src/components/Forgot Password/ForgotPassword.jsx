import React from "react";
import FeatherIcon from "feather-icons-react";
import "./ForgotPassword.css";
// import "../style.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordContent = () => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/sendingemail`;
    navigate(path);
  };

  return (
    <div class="forgot-container">
      <div class="title-container">
        <h1>
          <div class="title-container-border-icon">
            <FeatherIcon class="title-container-icon" icon="key" />
          </div>
        </h1>
        <h2>Forgot Password?</h2>
        <p>No worries, we'll send you instructions</p>
      </div>
      <div class="forgot-forms-container">
        <div class="forgot-password">
          <form class="forgot-password-form">
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="email" placeholder="Enter your email" />
            </div>
            <input
              type="submit"
              value="Reset password"
              class="btn solid"
              onClick={routeChange}
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;
