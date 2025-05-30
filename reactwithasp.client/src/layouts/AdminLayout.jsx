import React from 'react';
import MgNavBar from "@/main/MgNavBar";
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const AdminLayout = ({ children }) => {
  return (
    <>
      <MgNavBar>
        <Nav.Link href="index">Shop</Nav.Link>
        <Nav.Link href="indexAdmin">Admin</Nav.Link>
      </MgNavBar>
      <Container>
        <div id="adminLayout" style={{ border: '3px solid orange' }} >
          {children}
        </div>
      </Container>
    </>
  );
}

export default AdminLayout;