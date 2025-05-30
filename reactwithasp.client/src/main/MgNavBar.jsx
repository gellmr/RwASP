import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const MgNavBar = ({ children }) => {
  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary bg-dark" id="navBar" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">SPORTS STORE</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {children}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MgNavBar;