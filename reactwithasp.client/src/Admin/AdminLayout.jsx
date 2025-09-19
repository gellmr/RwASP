import React from 'react';
import { Outlet } from "react-router";
import { useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import "bootstrap/dist/css/bootstrap.css";
import SiteNavBar from "@/Nav/SiteNavBar";
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
          <SiteNavBar brandText="Admin Console" linkTo="/admin/orders" />
        </Row>
        <Outlet />
      </Container>
    </>
  );
}

export default AdminLayout;