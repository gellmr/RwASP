import React from 'react';
import MgNavBar from "@/main/MgNavBar";
import ProductSearchBox from "@/Shop/ProductSearchBox";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const ShopLayout = ({ children }) => {
  return (
    <>
      <MgNavBar>
        <Nav.Link href="index">Shop</Nav.Link>
        <Nav.Link href="indexAdmin">Admin</Nav.Link>
        <Nav.Link href="cart">
          <Button variant="success">Cart</Button>
        </Nav.Link>
      </MgNavBar>
      <Container id="shopLayout" style={{ border: '3px solid lime' }}>
        <Row>
          <Col xs={6}>All Products</Col>
          <Col xs={6}>
            <ProductSearchBox />
            <PaginationLinks />
            <InStockProductCanAdd>Product A</InStockProductCanAdd>
            <InStockProductCanAdd>Product B</InStockProductCanAdd>
            <InStockProductCanAdd>Product C</InStockProductCanAdd>
            <InStockProductCanAdd>Product D</InStockProductCanAdd>
            <InStockProductCanAdd>Product E</InStockProductCanAdd>
            <PaginationLinks />
          </Col>
        </Row>
        <hr />
        {children}
      </Container>
    </>
  );
}

export default ShopLayout;