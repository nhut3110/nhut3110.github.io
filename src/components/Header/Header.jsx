import React from "react";
import NavBar from "../Navbar/NavBar";
import "./Header.css";
// import "../style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Header = () => {
  return (
    <div>
      <div class="HomeHeader__container">
        <div class="HeaderText__container">
          <h1 class="header-title-text">Think.Make.Solve</h1>
          <h3 class="header-subtitle-text">- What we do</h3>
          <p class="header-description-text">
            We help you to manage your tasks in the delightful and
            human-centered experiences.
          </p>
          {localStorage.getItem("task-user") !== null ? (
            <a class="header-btn" href="/userspace">
              <p>Get started</p>
            </a>
          ) : (
            <a class="header-btn" href="/login">
              <p>Join Us</p>
            </a>
          )}
        </div>
        <div class="HeaderArt__container">
          <img src={require("../../assets/img/art.jpg")} alt="art" />
        </div>
      </div>

      <div class="HomeContent__container">
        <div class="left-feature__container">
          <img
            src={require("../../assets/img/illustration-statue-david-head-art-260nw-2126906357.jpg")}
            alt=""
          />
          <div class="left-feature-text__container">
            <h4>Build your</h4>
            <h3>Task Lists</h3>
            <hr />
          </div>
        </div>
        <div class="right-feature__container">
          <div class="feature-info__container">
            <div class="feature-info-image__container">
              <img
                src={
                  require("../../assets/img/tick-box-svgrepo-com.svg").default
                }
                alt="heh"
              />
            </div>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="feature-info-divider"></div>
          <div class="feature-info__container">
            <div class="feature-info-image__container">
              <img
                src={
                  require("../../assets/img/simle-face-svgrepo-com.svg").default
                }
                alt="heh"
              />
            </div>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="feature-info-divider"></div>
          <div class="feature-info__container">
            <div class="feature-info-image__container">
              <img
                src={require("../../assets/img/money-svgrepo-com.svg").default}
                alt="heh"
              />
            </div>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
