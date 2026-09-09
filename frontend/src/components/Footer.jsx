import React from "react";
import "../assets/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser , faHouseFloodWater } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <div className="footer-logo">
            <div className="footer-logo-icon">
                <FontAwesomeIcon icon={faHouseFloodWater} className="text-4xl p-2" />
            </div>
            <h2 className="font-bold text-4xl tracking-[1px]">
              RAKSHA{" "}SETU
            </h2>
          </div>
          <p className="font-bold">
            Built for faster disaster relief coordination.
            Connecting people who need help with people who
            can help.
          </p>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="footer-emergency">
          <h3>Emergency Numbers</h3>
          <p>
            National Emergency: <strong>112</strong>
          </p>
          <p>
            Disaster Helpline: <strong>1078</strong>
          </p>
          <p>
            NDMA: <strong>1070</strong>
          </p>
        </div>
      </div>
      <div className="footer-bottom font-medium">
        <p className="font-semibold">
          © 2026 RAKSHA{" "}SETU. All rights reserved.
        </p>
        <p>
          Built for faster disaster relief.
        </p>
      </div>
    </footer>
  );
}
export default Footer;