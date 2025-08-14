import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setGuest } from '@/features/login/loginSlice.jsx'
import { setCart, clearCart } from '@/features/cart/cartSlice.jsx'

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
import { axiosInstance } from '@/axiosDefault.jsx';
import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';

const ShopLayout = () =>
{
  const dispatch = useDispatch();
  const { category } = useParams();

  const location = useLocation();
  const [backCss, setBackCss] = useState('');

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;

  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  // If we are on My Orders page and there are no orders, or Cart page
  // and cart is empty, display the background using full transparent.
  let transparentClass = "shopLayoutTransparent bgRegularTransparent";
  const cartProducts = useSelector(state => state.cart.cartLines);
  const cartQty = cartProducts.reduce((sum, row) => sum + row.qty, 0);
  const myOrders = useSelector(state => state.myOrders.value);
  const ordQty = myOrders.reduce((sum, row) => sum + row.qty, 0);
  if (location.pathname === "/myorders" && ordQty === 0){
    transparentClass = "shopLayoutTransparent bgOrderFullTransparent";
  }
  if (location.pathname === "/cart" && cartQty === 0) {
    transparentClass = "shopLayoutTransparent bgCartFullTransparent";
  }
  if (location.pathname === "/checkout") {
    transparentClass = "shopLayoutTransparent bgStrongTransparent";
  }
  if (location.pathname.includes("/myorders/")) {
    transparentClass = "shopLayoutTransparent bgStrongTransparent";
  }
  const bgTransparentClass = transparentClass;

  // Background css
  useEffect(() => {
    let css = "soccerBg1";
    switch (category) {
      case 'soccer': css = "soccerBg2"; break;
      case 'chess': css = "chessBg"; break;
      case 'waterSport': css = "kayakBg"; break;
    }
    setBackCss("soccerBaseBg " + css);
  }, [location]);

  // Fetch generated guest id from server, on page load.
  useEffect(() => {
    fetchGuest();
  }, [loginValue, ordQty]);

  useEffect(() => {
    if (!nullOrUndefined(myUserId) || !nullOrUndefined(guestID)) {
      // Once we have the guest id, we can load the orders. Navbar is a child prop that
      // contains UI which depends on having the latest My Orders data from server.
      dispatch(fetchMyOrders({ uid: myUserId, gid: guestID })); // Invoke thunk
    }
  }, [myUserId, guestID]);

  // Fetch the cart, if login value or guest id changes.
  useEffect(() => {
    fetchCart();
  }, [guestID, loginValue]);

  async function fetchGuest() {
    try {
      const url = window.location.origin + "/api/guest";
      axiosInstance.get(url).then((response) => {
        dispatch(setGuest(response.data)); // Receive the guest id from server
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("fetchGuest completed after retries.");
      });
    } catch (err) {
      // Something went wrong.
      let a = 1;
    }
  }

  async function fetchCart() {
    try {
      const url = window.location.origin + "/api/cart";
      axiosInstance.get(url).then((response) => {
        dispatch(setCart(response.data));
      })
      .catch((error) => {
        //console.log(error);
      })
      .finally(() => {
        console.log("fetchCart completed after retries.");
      });
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

        <Row className="shopMain">
          <CategoriesMenu />
          <Col xs={0}  md={1}        className="d-none d-md-block">
            {/* LSPACE */}
          </Col>
          <Col xs={12} md={8} lg={6} className={bgTransparentClass}>
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