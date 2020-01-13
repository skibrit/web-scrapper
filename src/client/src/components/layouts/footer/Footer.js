import React from "react";
import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer-section container-fluid">
      <footer className="bg-black small text-center text-white-50">
        <div className="container">
          <h3 className="f-content">
            Crafted By &copy; <span>Saidul Amin</span>
          </h3>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
