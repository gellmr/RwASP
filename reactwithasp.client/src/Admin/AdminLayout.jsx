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
import ShopButton from "@/Shop/ShopButton";
import VL from "@/Shop/VL";
import Footer from "@/Shop/Footer";
import { useLocation } from 'react-router';

import '@/AdminLayout.css'

const AdminLayout = () =>
{
  const location = useLocation();
  const isLogin = (location.pathname == "/admin")
  const showBackArrow = !(isLogin);

  return (
    <>
      <Container fluid id="adminLayout" className="adminBgBase adminBg1">
        <Row>
          <MgNavBar showCart={false} useFluid={true} brandText="Admin Console" linkTo="/admin/orders">
            <ShopButton withBackArrow={showBackArrow} />
            <VL />
            <AdminLink />
            <CurrUserNavLink />
          </MgNavBar>
        </Row>

        <Outlet />

        <hr />
        <Footer />
      </Container>
    </>
  );
}

export default AdminLayout;