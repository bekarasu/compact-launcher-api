import React from "react";
import { Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../resources/strings/app";
export default class Navbar extends React.Component {
  render() {
    return (
      <BootstrapNavbar bg="light" expand="lg">
        <BootstrapNavbar.Brand href="/">{APP_NAME}</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/" className="nav-link">
              Homepage
            </Link>
            <Link to="/about-us" className="nav-link">
              About Us
            </Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>
    );
  }
}
