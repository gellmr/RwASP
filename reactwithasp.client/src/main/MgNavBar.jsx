import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router";
import CartBtn from "@/Shop/CartBtn";

const MgNavBar = ({ children, showCart=true, useFluid=false, brandText="SPORTS STORE", linkTo="/" }) => {
  const CartButtonMarkup = showCart && <CartBtn isSmall={true} />;
  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary bg-dark" id="navBar" data-bs-theme="dark">
        <Container fluid={useFluid} style={{ maxWidth:"100%"}}>
          <NavLink to={linkTo} className="storeBrand" style={{ textWrapMode: "nowrap"}}>{brandText}</NavLink>

          {/* xs screen render cart button here also */}
          {CartButtonMarkup}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto mg-nav-items">
              {children}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MgNavBar;