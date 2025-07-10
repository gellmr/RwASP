import React from 'react';
import { Outlet } from "react-router";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "bootstrap/dist/css/bootstrap.css";
import MgNavBar from "@/main/MgNavBar";
import ShopButton from "@/Shop/ShopButton";
import AdminLink from "@/Admin/AdminLink";
import CurrUserNavLink from "@/CurrUser/CurrUserNavLink";

const NoShopLayout = () => {
  return (
    <>
      <MgNavBar>
        <ShopButton withBackArrow={false} />
        <AdminLink />
        <CurrUserNavLink />
      </MgNavBar>

      <Container id="noShopLayout" style={{ border: '' }}>
        <Row>
          
          <Col sm={12} style={{ border: "", paddingTop: "15px", paddingBottom: "12px" }}>
            <Outlet /> {/* This will be either Shop or Cart... */}
          </Col>
        </Row>
        <hr />
        Built with React and ASP, using .NET 8.0 and Vite
      </Container>
    </>
  );
}
export default NoShopLayout;