import React from 'react';
import { Outlet } from "react-router";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "bootstrap/dist/css/bootstrap.css";
import SiteNavBar from "@/Nav/SiteNavBar";
import Footer from "@/Shop/Footer";

const LoginLayout = () =>
{
  return (
    <>
      <Container id="loginLayout" style={{ border: '' }}>
        <Row>
          <SiteNavBar />
        </Row>

        <Row>
          <Col sm={12} style={{ border: "", paddingTop: "15px", paddingBottom: "12px" }}>
            <Outlet /> {/* This will be either Shop or Cart... */}
          </Col>
        </Row>
        <hr />
        <Footer />
      </Container>
    </>
  );
}

export default LoginLayout;