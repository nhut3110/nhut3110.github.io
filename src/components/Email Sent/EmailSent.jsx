import React from "react";
import FeatherIcon from "feather-icons-react";
import "./EmailSent.css";
// import "../style.css";
import { Link } from "react-router-dom";

const EmailSent = () => {
  return (
    <div>
      <div class="sending-email-container">
        <div class="title-container">
          <h1>
            <div class="title-container-border-icon">
              <FeatherIcon class="title-container-icon" icon="unlock" />
            </div>
          </h1>
          <h2>Reset Password!</h2>
        </div>
        <div class="email-notification-container">
          <div class="notification-box">
            <p class="notification-content">
              We already sent you an email to reset your password, please check
              your inbox!
            </p>
          </div>
          <p class="resent-email-text">
            Haven't received email?{" "}
            <button class="reg-btn" onClick={(e) => {}}>
              Click here
            </button>
          </p>
          <p class="social-text">
            <button class="reg-btn" onClick={(e) => {}}>
              <Link to="/login">← Back to log in</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
