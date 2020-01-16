import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <Link to="/" className="navbar-brand">
        WebScraper
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/search" onClick={e => {}}>
              Search Property
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin" onClick={e => {}}>
              Scrape New
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
