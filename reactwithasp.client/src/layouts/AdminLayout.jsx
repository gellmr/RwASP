import React from 'react';
import NavBar from "@/main/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';

const AdminLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="index">Back to Shop</a></NavBar>
      <Container>
        <div id="adminLayout" style={{ border: '3px solid orange' }} >
          {children}
        </div>
      </Container>
    </>
  );
}

export default AdminLayout;