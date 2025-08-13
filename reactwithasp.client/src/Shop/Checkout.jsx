import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import CartBar from "@/Shop/CartBar";
import CheckoutFormik from "@/Shop/CheckoutFormik";

import '@/Checkout.css'

function Checkout()
{  
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