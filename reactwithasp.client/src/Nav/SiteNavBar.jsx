import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router";
import ShopButton from "@/Nav/Links/ShopButton";
import AdminConsoleBtn from "@/Nav/Links/AdminConsoleBtn";
import VL from "@/Nav/Links/VL";
import '@/Nav/Nav.css'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import MyOrdersBtn from '@/Nav/Links/MyOrdersBtn';
import AdminPagesBtn from '@/Nav/Links/AdminPagesBtn';
import ProductsBtn from '@/Nav/Links/ProductsBtn';
import BackLogBtn from '@/Nav/Links/BackLogBtn';
import CustAccountsBtn from '@/Nav/Links/CustAccountsBtn';
import CartBtn from "@/Nav/Links/CartBtn";
import SmallCartBtn from "@/Nav/Links/SmallCartBtn";

const SiteNavBar = ({ brandText = "SPORTS STORE", linkTo = "/" }) =>
{
  const useFluid = (linkTo == "/" ? false : true);
  const showCart = (linkTo == "/" ? true : false);
  const SmallCartButtonMarkup = showCart && <div className="d-inline-block d-sm-none">
    <SmallCartBtn />
  </div>;
  const NormalCartButtonMarkup = showCart && <div className="d-none d-sm-inline-block">
    <CartBtn /><VL />
  </div>;

  const [orderCount, setOrderCount] = useState(null);
  const location = useLocation();
  const withinAdmin = location.pathname.indexOf("/admin") !== -1;
  const login = useSelector(state => state.login.user);
  const isLoggedIn = (login !== null);
  const myOrders = useSelector(state => state.myOrders.value);

  const myOrdersCount = function () {
    if (orderCount !== null && orderCount != 0) {
      return (<>&nbsp;({orderCount})</>);
    }
    return (<></>);
  }

  useEffect(() => {
    const oc = (myOrders !== undefined && myOrders.length > 0) ? myOrders.length : null;
    console.log("order count: " + oc);
    setOrderCount(oc);
  }, [myOrders]);

  const adminLinks = (
    <>
      <ProductsBtn /><VL />
      <BackLogBtn /><VL />
      <CustAccountsBtn />
    </>
  );
  const loggedInLinks = (
    <>
      {NormalCartButtonMarkup}
      <MyOrdersBtn orderCount={myOrdersCount()} /><VL />
      <AdminPagesBtn />
    </>
  );
  const loggedOutLinks = (
    <>
      {NormalCartButtonMarkup}
      <MyOrdersBtn orderCount={myOrdersCount()} />
    </>
  );

  const conditional = function ()
  {
    if (isLoggedIn && withinAdmin){
      return (<>{adminLinks}</>); // Logged in and currently on the admin pages
    }
    else if (isLoggedIn){
      return (<>{loggedInLinks}</>); // Logged in but not on the admin pages
    }
    return (<>{loggedOutLinks}</>); // Not logged in
  }

  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary bg-dark" id="navBar" data-bs-theme="dark">
        <Container fluid={useFluid} style={{ maxWidth:"100%"}}>
          <NavLink to={linkTo} className="storeBrand" style={{ textWrapMode: "nowrap"}}>{brandText}</NavLink>

          {/* xs screen render cart button here also */}
          {SmallCartButtonMarkup}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto mg-nav-items">
              <ShopButton withBackArrow={linkTo=="/"?false:true} /><VL />
              {conditional()}
              <AdminConsoleBtn />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default SiteNavBar;