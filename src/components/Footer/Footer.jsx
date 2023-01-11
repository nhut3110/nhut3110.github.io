import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <footer class="footer">
      <div class="Footer__container">
        <div class="row">
          <div class="footer-col">
            <h4>Taskey</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/userspace">Task Lists</a>
              </li>
              <li>
                <a href="/profile">Personal</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>get help</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Suggestion</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Features</h4>
            <ul>
              <li>
                <a href="#">Task Lists</a>
              </li>
              <li>
                <a href="#">Todos</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>follow us</h4>
            <div class="social-links">
              <a href="#">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
