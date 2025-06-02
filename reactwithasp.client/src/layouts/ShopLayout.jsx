import React from 'react';

import { useSelector } from 'react-redux'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import "bootstrap/dist/css/bootstrap.css";

import MgNavBar from "@/main/MgNavBar";
import ProductSearchBox from "@/Shop/ProductSearchBox";
import MgCategoryMenu from "@/Shop/MgCategoryMenu";

const ShopLayout = ({ children }) => {
  const cartProducts = useSelector(state => state.cart.value);
  return (
    <>
      <MgNavBar>
        <Nav.Link href="index">Shop</Nav.Link>
        <Nav.Link href="indexAdmin">Admin</Nav.Link>
        <Nav.Link href="cart">
          <Button variant="success">
            Cart: {
              cartProducts && cartProducts.length
            }
          </Button>
        </Nav.Link>
      </MgNavBar>
      <Container id="shopLayout" style={{ border: '' }}>
        <Row>
          <Col className="d-block d-sm-none" style={{ border: '', padding:"0px" }}>
            <MgCategoryMenu isVertical={true} />
          </Col>
          <Col className="d-none d-sm-block d-md-none" style={{ border: '', padding: "0px" }}>
            <MgCategoryMenu />
          </Col>
          <Col className="d-none d-md-block col-md-3" style={{ border: '', padding: "0px" }}>
            <MgCategoryMenu  isVertical={true}/>
          </Col>
          <Col sm={12} md={9} style={{ border:"", paddingTop:"15px", paddingBottom:"12px"}}>
            <ProductSearchBox />
            {children}
          </Col>
        </Row>
        <hr />
        Built with React and ASP, using .NET 8.0 and Vite
      </Container>
    </>
  );
}

export default ShopLayout;