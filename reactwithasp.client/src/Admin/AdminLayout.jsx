import React from 'react';

import { NavLink } from "react-router";
import { Outlet } from "react-router";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import "bootstrap/dist/css/bootstrap.css";

import MgNavBar from "@/main/MgNavBar";
import CurrUserNavLink from "@/CurrUser/CurrUserNavLink";
import AdminLink from "@/Admin/AdminLink";


const AdminLayout = () =>
{
  return (
    <>
      <MgNavBar showCart={false}>
        <NavLink to="/" className="mgNavLinkBtn" >Shop</NavLink>
        <AdminLink />
        <CurrUserNavLink />
      </MgNavBar>
      <Container id="shopLayout" style={{ border: '' }}>
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

export default AdminLayout;