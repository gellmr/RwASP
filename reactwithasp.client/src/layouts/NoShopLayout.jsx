import React from 'react';
import { Outlet } from "react-router";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "bootstrap/dist/css/bootstrap.css";
import SiteNavBar from "@/Nav/SiteNavBar";
import Footer from "@/Shop/Footer";

const NoShopLayout = () => {
  return (
    <>
      <Container id="noShopLayout" className="soccerBaseBg" style={{ border: '' }}>
        <Row>
          <SiteNavBar />
        </Row>

        <Row>
          <Col xs={0} md={2} lg={3} className="d-none d-md-block">
             {/*LSPACE */}
          </Col>
          <Col xs={12} md={8} lg={6} className="shopLayoutTransparent" style={{ border: "", paddingTop: "15px", paddingBottom: "12px" }}>
            <Outlet /> {/* This will be either Shop or Cart... */}
          </Col>
          <Col xs={0} md={2} lg={3} className="d-none d-md-block">
             {/*RSPACE */}
          </Col>
        </Row>
        <hr />
        <Footer />
      </Container>
    </>
  );
}
export default NoShopLayout;