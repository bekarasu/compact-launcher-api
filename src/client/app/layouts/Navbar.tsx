import React from "react";
import { Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";
export default class Navbar extends React.Component {
  render() {
    return (
      <BootstrapNavbar bg="light" expand="lg">
        <BootstrapNavbar.Brand href="/"></BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/" className="nav-link">
              Homepage
            </Link>
            <Link to="/programs" className="nav-link">
              Programs
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
