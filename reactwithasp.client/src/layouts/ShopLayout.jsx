import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setCart, clearCart } from '@/features/cart/cartSlice.jsx'

import { NavLink } from "react-router";
import { Outlet } from "react-router";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import "bootstrap/dist/css/bootstrap.css";

import MgNavBar from "@/main/MgNavBar";
import CategoriesMenu from "@/Shop/CategoriesMenu";
import CartBtn from "@/Shop/CartBtn";
import CurrUserNavLink from "@/CurrUser/CurrUserNavLink";
import AdminLink from '@/Admin/AdminLink';
import EnvName from "@/Shop/EnvName";

const ShopLayout = () =>
{
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const url = window.location.origin + "/api/cart";
      const response = await fetch(url);
      const data = await response.json();
      dispatch(setCart(data));
    } catch (err) {
      dispatch(clearCart());
    }
  }

  return (
    <>
      <MgNavBar>
        <NavLink to="/" className="mgNavLinkBtn" >Shop</NavLink>
        <AdminLink />
        <CartBtn isSmall={false} />
        <CurrUserNavLink />
      </MgNavBar>
      <Container id="shopLayout" style={{ border: '' }}>
        <Row>
          <CategoriesMenu />
          <Col sm={12} md={9} style={{ border:"", paddingTop:"15px", paddingBottom:"12px"}}>
            <Outlet /> {/* This will be either Shop or Cart... */}
          </Col>
        </Row>
        <hr />
        Built with React and ASP, using .NET 8.0 and Vite
        <br />
        {/*<EnvName />*/}
      </Container>
    </>
  );
}

export default ShopLayout;