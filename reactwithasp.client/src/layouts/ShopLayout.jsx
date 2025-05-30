import React from 'react';
import MgNavBar from "@/main/MgNavBar";
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const ShopLayout = ({ children }) => {
  return (
    <>
      <MgNavBar>
        <Nav.Link href="indexAdmin">Admin</Nav.Link>
      </MgNavBar>
      <Container>
        <div id="shopLayout" style={{ border: '3px solid lime'}} >
          {children}
        </div>
      </Container>
    </>
  );
}

export default ShopLayout;