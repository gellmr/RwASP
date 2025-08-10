import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router";
import { clearCart } from '@/features/cart/cartSlice.jsx'
import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CartBar from "@/Shop/CartBar";

import '@/Checkout.css'

function Checkout()
{
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [firstName,   setFirstName] = useState('');
  const [lastName,    setLastName] = useState('');
  const [shipLine1, setShipLine1] = useState('');
  const [shipLine2, setShipLine2] = useState('');
  const [shipLine3, setShipLine3] = useState('');
  const [shipCity,     setShipCity] = useState('');
  const [shipState,    setShipState] = useState('');
  const [shipCountry,  setShipCountry] = useState('');
  const [shipZip,      setShipZip] = useState('');
  const [shipEmail, setShipEmail] = useState('');

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;
  const cart = useSelector(state => state.cart.cartLines);
  const cartPayload = JSON.parse(JSON.stringify(cart));

  const loginValue = useSelector(state => state.login.value);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName,
          shipLine1, shipLine2, shipLine3,
          shipCity, shipState, shipCountry, shipZip,
          shipEmail,
          guestID: guestID, cart: cartPayload
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);
      dispatch(clearCart());
      // A new order will have appeared under My Orders. Fetch from server to update the UI.
      dispatch(fetchMyOrders({ uid: myUserId, gid: guestID })); // Invoke thunk
      navigate("/checkoutsuccess");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const autoFill = function (e) {
    setFirstName("John");
    setLastName("Doe");
    setShipLine1("123 River Gum Way");
    setShipLine2("Unit 10/150, Third Floor");
    setShipLine3("The Tall Apartment Building (Inc)");
    setShipCity("SpringField");
    setShipState("WA");
    setShipCountry("Australia");
    setShipZip("6525");
    setShipEmail("email@address.com");
  }

  return (
    <>
      <h2 style={{ marginTop: "5px" }}>Checkout</h2>
      <div className="col-12">
        <Row>
          {/* <CartBar /> */}
          <Col className="checkoutLines">

            <div className="shipHeading">Please provide your details below, and we'll ship your goods right away.</div>

            <Form onSubmit={handleSubmit}>
              <h5 className="shipHeading">Please provide your name...</h5>

              <InputGroup className="mb-3">
                <InputGroup.Text>First Name</InputGroup.Text>
                <Form.Control id="shipFirstName" name="shipFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Please enter your First Name"/>
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text>Last Name</InputGroup.Text>
                <Form.Control id="shipLastName" name="shipLastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Please enter your Last Name" />
              </InputGroup>

              <h5 className="shipHeading">Shipping Address</h5>
              <InputGroup className="mb-3">
                <InputGroup.Text>Line 1</InputGroup.Text>
                <Form.Control id="shipLine1" name="shipLine1" type="text" value={shipLine1} onChange={(e) => setShipLine1(e.target.value)} placeholder="Street address / house number" />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Line 2</InputGroup.Text>
                <Form.Control id="shipLine2" name="shipLine2" type="text" value={shipLine2} onChange={(e) => setShipLine2(e.target.value)} placeholder="Apartment / unit / floor number" />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Line 3</InputGroup.Text>
                <Form.Control id="shipLine3" name="shipLine3" type="text" value={shipLine3} onChange={(e) => setShipLine3(e.target.value)} placeholder="Any extra details that might help the courier" />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text>City</InputGroup.Text>
                <Form.Control id="shipCity" name="shipCity" type="text" value={shipCity} onChange={(e) => setShipCity(e.target.value)} placeholder="Your suburb / city / town" />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>State</InputGroup.Text>
                <Form.Control id="shipState" name="shipState" type="text" value={shipState} onChange={(e) => setShipState(e.target.value)} placeholder="Eg, Western Australia" />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Country</InputGroup.Text>
                <Form.Control id="shipCountry" name="shipCountry" type="text" value={shipCountry} onChange={(e) => setShipCountry(e.target.value)} placeholder="Eg, Australia" />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Zip</InputGroup.Text>
                <Form.Control id="shipZip" name="shipZip" type="text" value={shipZip} onChange={(e) => setShipZip(e.target.value)} placeholder="Eg, 6000" />
              </InputGroup>

              <h5 className="shipHeading">Your Email Address</h5>
              <InputGroup className="mb-5">
                <InputGroup.Text>Email</InputGroup.Text>
                <Form.Control id="shipEmail" name="shipEmail" type="text" value={shipEmail} onChange={(e) => setShipEmail(e.target.value)} placeholder="Please enter a valid email address" />
              </InputGroup>

              <ButtonGroup className="checkoutSubmitBtnGroup">
                <Button variant="light" className={"btn"} onClick={autoFill} type="button"><i className="bi bi-list-check"></i>&nbsp;Autofill</Button>
                <Button variant="success" className={"btn btn-primary"} type="submit" >Complete Order</Button>
              </ButtonGroup>

            </Form>

          </Col>
          {/* <CartBar /> */}
        </Row>
      </div>
    </>
  );
}
export default Checkout;