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
          <Col xs={12}>
            <MgCategoryMenu propClasses="d-block d-sm-none" propStyle={{ border: '2px dashed orange' }} />
          </Col>
          <Col xs={6}>
            <MgCategoryMenu propClasses="d-none d-sm-block" propStyle={{ border: '2px dashed green' }} isVertical={true} />
          </Col>
          <Col xs={6} style={{ border:"3px dashed"}}>
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