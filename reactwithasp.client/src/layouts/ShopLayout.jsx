import React from 'react';
import NavBar from "@/main/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';

const ShopLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="indexAdmin">Admin Page</a></NavBar>
      <Container>
        <div id="shopLayout" style={{ border: '3px solid lime'}} >
          {children}
        </div>
      </Container>
    </>
  );
}

export default ShopLayout;