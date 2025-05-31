import React from 'react';
import MgNavBar from "@/main/MgNavBar";
import ProductSearchBox from "@/Shop/ProductSearchBox";
import MgCategoryMenu from "@/Shop/MgCategoryMenu";
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
          <Col className="d-block d-sm-none" style={{ border: '2px dashed orange' }}>
            <MgCategoryMenu/>
          </Col>
          <Col className="d-none d-sm-block col-sm-6" style={{ border: '2px dashed green' }}>
            <MgCategoryMenu  isVertical={true}/>
          </Col>

          <Col xs={12} sm={6} style={{ border:"3px dashed"}}>
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