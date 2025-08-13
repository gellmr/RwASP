import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router";
//import { clearCart } from '@/features/cart/cartSlice.jsx'
//import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';
//import Button from 'react-bootstrap/Button';
//import ButtonGroup from 'react-bootstrap/ButtonGroup';
//import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import CartBar from "@/Shop/CartBar";
import CheckoutFormik from "@/Shop/CheckoutFormik";

import '@/Checkout.css'

function Checkout()
{
  const dispatch = useDispatch();
  let navigate = useNavigate();

  let _firstname;
  let _lastname;

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;

  _firstname = (guest === null) ? '' : guest.firstname;
  _lastname  = (guest === null) ? '' : guest.lastname;

  const cart = useSelector(state => state.cart.cartLines);
  const cartPayload = JSON.parse(JSON.stringify(cart));

  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  _firstname = (loginValue === null) ? _firstname : loginValue.firstname;
  _lastname  = (loginValue === null) ? _lastname  : loginValue.lastname;
      
  return (
    <>
      <h2 style={{ marginTop: "5px" }}>Checkout</h2>
      <div className="col-12">
        <Row>
          {/* <CartBar /> */}
          <Col className="checkoutLines">
            <div className="shipHeading">Please provide your details below, and we'll ship your goods right away.</div>
            <CheckoutFormik />
          </Col>
          {/* <CartBar /> */}
        </Row>
      </div>
    </>
  );
}
export default Checkout;