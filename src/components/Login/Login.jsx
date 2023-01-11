// import "../style.css";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constants";
import React, { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const userEmail = useRef();
  const userPassword = useRef();

  const [user, setUser] = useState({});
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://dev.thanqminh.com:3000/auth/sign_in",
        {
          email: userEmail.current.value.toString(),
          password: userPassword.current.value.toString(),
        }
      );
      console.log(res);
      // setUser({});
      localStorage.setItem(
        "task-user",
        JSON.stringify({
          dataUser: res.data,
          uid: res.headers["uid"],
          access_token: res.headers["access-token"],
          client: res.headers["client"],
        })
      );
      console.log(JSON.parse(localStorage.getItem("task-user")));
      setErrors("");
      navigate("/profile");
    } catch (err) {
      console.log(err.response);
      if (err.response.status == 401) {
        setErrors(err.response.data.errors.join(" and "));
      }
    }
  };
  return (
    <div>
      <div class="container sign-up-mode ">
        <div class="forms-container">
          <div class="signin-signup">
            <form action="profile.html" class="sign-up-form">
              <h2 class="title">Welcome back!</h2>
              <div class="input-field">
                <i class="fas fa-user"></i>
                <input type="text" placeholder="Email" ref={userEmail} />
              </div>
              <div class="input-field">
                <i class="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  ref={userPassword}
                />
              </div>
              {errors !== "" ? <p className="List__error">{errors}</p> : null}
              <div class="remember-container">
                <p class="remember-text">
                  <input
                    type="checkbox"
                    class="remember-checkbox"
                    defaultChecked={true}
                  />{" "}
                  Remember me
                </p>
                {/* <p class="forgot-password-text">
                  <a href="forgot.html">Forgot Password</a>
                </p> */}
              </div>
              {/* <Link class="button__login" to="/userspace"> */}
              <input
                type="submit"
                value="Login"
                class="btn solid "
                onClick={handleSignin}
              />
              {/* </Link> */}
              {/* <input
                type="submit"
                value="Sign in with Google"
                class="btn solid"
              /> */}
              <p class="social-text">
                Are you new here?
                <Link to="/register">
                  {/* <a
                    href="register.html"
                    class="reg-btn"
                  > */}
                  Sign up
                  {/* </a> */}
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div class="panels-container">
          <div class="panel left-panel">
            <div class="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Debitis, ex ratione. Aliquid!
              </p>
            </div>
            <img src={images.logoLogin} class="image" alt="" />
          </div>
          <div class="panel right-panel">
            <div class="content">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
            </div>
            <img src={images.logoRegister} class="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
