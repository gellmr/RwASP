import React from 'react';
import { Outlet } from "react-router";
import { useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import "bootstrap/dist/css/bootstrap.css";

import MgNavBar from "@/Nav/SiteNavBar";
import CurrUserNavLink from "@/Nav/Links/CurrUserNavLink";
import AdminLink from "@/Nav/Links/AdminLink";
import ShopButton from "@/Nav/Links/ShopButton";
import VL from "@/Nav/Links/VL";

import Footer from "@/Shop/Footer";

const LoginLayout = () =>
{
  const location = useLocation();
  const isLogin = (location.pathname == "/admin")
  const showBackArrow = !(isLogin);

  return (
    <>
      <Container id="loginLayout" style={{ border: '' }}>
        <Row>
          <MgNavBar showCart={false}>
            <ShopButton withBackArrow={showBackArrow} />
            <VL />
            <AdminLink />
            <CurrUserNavLink />
          </MgNavBar>
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