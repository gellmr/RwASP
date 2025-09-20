import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router";

import '@/Nav/Nav.css'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import NavLoggedIn from "@/Nav/NavLoggedIn";
import NavLoggedOut from "@/Nav/NavLoggedOut";
import NavAdminLoggedIn from "@/Nav/NavAdminLoggedIn";

const SiteNavBar = ({ brandText = "SPORTS STORE", linkTo = "/" }) =>
{
  const useFluid = (linkTo == "/" ? false : true);
  
  const [orderCount, setOrderCount] = useState(null);
  const location = useLocation();
  const withinAdmin = location.pathname.indexOf("/admin") !== -1;
  const login = useSelector(state => state.login.user);
  const isLoggedIn = (login !== null);
  const myOrders = useSelector(state => state.myOrders.value);

  const myOrdersCount = function ()
  {
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

  const navContent = function ()
  {
    if (isLoggedIn && withinAdmin)
    {
      return <NavAdminLoggedIn />;
    }
    else if (isLoggedIn)
    {
      return <NavLoggedIn myOrdersCount={myOrdersCount} />;
    }
    return <NavLoggedOut myOrdersCount={myOrdersCount} />;
  }

  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary bg-dark" id="navBar" data-bs-theme="dark">
        <Container fluid={useFluid} style={{ maxWidth:"100%"}}>
          <NavLink to={linkTo} className="storeBrand" style={{ textWrapMode: "nowrap"}}>{brandText}</NavLink>
          {navContent()}
        </Container>
      </Navbar>
    </>
  );
}

export default SiteNavBar;