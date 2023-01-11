import { React, useRef } from "react";
import "./ChangePass.css";
// import "../style.css";
import FeatherIcon from "feather-icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert, positions, Provider as AlertProvider } from "react-alert";
import axios from "axios";

const ChangePass = () => {
  const newPassword = useRef();
  const confirmPassword = useRef();
  const alert = useAlert();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("task-user"));
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };
  // console.log(user);
  const routeChange = () => {
    let path = `/changesuccess`;
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPassword.current.value);
    console.log(confirmPassword.current.value);
    newPassword.current.value !== confirmPassword.current.value
      ? console.log("Confirm password is different from new password")
      : await axios
          .put(
            "https://dev.thanqminh.com:3000/auth/password",
            {
              email: user.dataUser.data.email,
              password: newPassword.current.value,
              password_confirmation: confirmPassword.current.value,
            },
            {
              headers: headers,
            }
          )
          .then((resp) => {
            console.log(resp);
            setTimeout(() => {
              routeChange();
            }, 100);
          });
  };

  return (
    <div>
      <div class="change-password-container">
        <div class="title-container">
          <h1>
            <div class="title-container-border-icon">
              <FeatherIcon class="title-container-icon" icon="refresh-ccw" />
            </div>
          </h1>
          <h2>Change Password</h2>
        </div>
        <div class="change-password-forms-container">
          <div class="change-password-password">
            <form onSubmit={handleSubmit} class="change-password--form">
              <div class="input-field">
                <i class="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="New password"
                  ref={newPassword}
                  required
                />
              </div>
              <div class="input-field">
                <i class="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Confirm password"
                  ref={confirmPassword}
                  required
                />
              </div>
              <input
                type="submit"
                value="Reset password"
                class="btn solid"
                // onClick={handleSubmit}
              />
              <p class="social-text">
                <button class="reg-btn" onClick={(e) => {}}>
                  <Link to="/">← Back to homepage</Link>
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
