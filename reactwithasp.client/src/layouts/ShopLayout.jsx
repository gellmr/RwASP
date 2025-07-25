import React from 'react';
import { useState, useEffect } from 'react';
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
import CurrUserNavLink from "@/CurrUser/CurrUserNavLink";
import AdminLink from '@/Admin/AdminLink';
import EnvName from "@/Shop/EnvName";
import ShopButton from "@/Shop/ShopButton";
import Footer from "@/Shop/Footer";
import VL from "@/Shop/VL";
import { useParams } from 'react-router';
import { useLocation } from 'react-router';

const ShopLayout = () =>
{
  const dispatch = useDispatch();
  const { category } = useParams();

  const location = useLocation();
  const [backCss, setBackCss] = useState('');

  useEffect(() => {
    let css = "soccerBg1";
    switch (category) {
      case 'soccer': css = "soccerBg2"; break;
      case 'chess': css = "chessBg"; break;
      case 'waterSport': css = "kayakBg"; break;
    }
    setBackCss("soccerBaseBg " + css);
  }, [location]);

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
    <div >
      <Container id="shopLayout" className={backCss} style={{ border: '' }}>
        <Row>
          <MgNavBar>
            <ShopButton withBackArrow={false} />
            <VL />
            <AdminLink />
            <CurrUserNavLink />
          </MgNavBar>
        </Row>

        <Row >
          <CategoriesMenu />
          <Col xs={0}  md={1}        className="d-none d-md-block">
            {/* LSPACE */}
          </Col>
          <Col xs={12} md={8} lg={6} className="shopLayoutTransparent">
            <Outlet /> {/* This will be either Shop or Cart... */}
          </Col>
          <Col xs={0} lg={2}         className="d-none d-lg-block">
            {/* RSPACE */}
          </Col>
        </Row>
        <hr />
        <Footer />
        {/*<EnvName />*/}
      </Container>
    </div>
  );
}

export default ShopLayout;