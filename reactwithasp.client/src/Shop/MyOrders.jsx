import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NavLink } from "react-router";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import displayDate from '@/Shop/displayDate.jsx';
import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx';
import { nullOrUndefined } from '@/MgUtility.js';

import '@/MyOrders.css'

const MyOrders = () =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const ordersThisPage = useSelector(state => state.myOrders.value);

  let full_name;

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;
  full_name = !nullOrUndefined(guest) ? guest.fullname : null;

  const loginValue = useSelector(state => state.login.value);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;
  full_name = !nullOrUndefined(loginValue) ? loginValue.fullname : full_name;
  
  const fullname = full_name;

  // "Guest" | "User" | null
  const accType = !nullOrUndefined(guestID) ? "Guest" : (!nullOrUndefined(loginValue) ? loginValue.loginType : null );
  const idval   = !nullOrUndefined(guestID) ? guestID : (!nullOrUndefined(myUserId)   ? myUserId : null) ;

  useEffect(() => {
    if (!nullOrUndefined(ordersThisPage) && Array.isArray(ordersThisPage)) {
      // Finished loading
      setIsLoading(false);
    } else {
      // Initiate loading
      dispatch(fetchMyOrders({ uid: myUserId, gid: guestID })); // Invoke thunk
      setIsLoading(true);
    }
  }, [ordersThisPage]);

  const noOrdersMarkup = () => (
    <>
      <div className="ordersEmptyMsg">
        (None at the moment)
      </div>
      <div style={{ height:250 }}>
        &nbsp;
      </div>
    </>
  );

  const orderRow = function (ord) {
    return (
      <Col xs={12} key={ord.id}>
        <div className="myOrdersTable">
          <table style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              <tr>
                <td>Order Number</td>
                <td style={{ fontWeight: 600 }}>{ord.id}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{ord.orderStatus}</td>
              </tr>
              <tr>
                <td>Placed Date</td>
                <td>
                  {displayDate(ord.orderPlacedDate)}
                </td>
              </tr>
              <tr>
                <td>Items</td>
                <td>{ord.itemString}</td>
              </tr>
              <tr>
                <td>Total Items</td>
                <td>{ord.quantityTotal}</td>
              </tr>
              <tr>
                <td>Price Total</td>
                <td>$ {ord.priceTotal}</td>
              </tr>

              <tr>
                <td>Ship To:</td>
                <td className="shipAddy">{ord.shippingAddress}</td>
              </tr>

              <tr>
                <td></td>
                <td style={{ textAlign: 'right', paddingBottom: 15 }}>
                  <NavLink to={"/myorders/" + ord.id} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                    View Details <i className="bi bi-arrow-right-short"></i>
                  </NavLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
    );
  }

  const rowsMarkup =
    (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    (!ordersThisPage) ? <div className="fetchErr">( Could not find any Orders! )</div> : (
    (ordersThisPage.length === 0) ? noOrdersMarkup() : (
      ordersThisPage && ordersThisPage.map(ord => orderRow(ord))
  ))));

  const accountInfo = function () {
    if (!ordersThisPage || ordersThisPage.length === 0) {
      return (<></>);
    }
    return (
      <Col xs={12}>
        <div className="myOrdersTable myOrdersHeadInfo">
          <Row>
            <Col xs={4}>Account&nbsp;Type:</Col> <Col xs={8}>{accType}</Col>
          </Row>
          <Row>
            <Col xs={4}>{accType} ID:</Col>  <Col xs={8} className="guid">{idval}</Col>
          </Row>
          <Row>
            <Col xs={4}>Full&nbsp;Name:</Col> <Col xs={8}>{fullname}</Col>
          </Row>
        </div>
      </Col>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div style={{ textAlign: "center", paddingLeft: 15, paddingBottom: 5 }}>
            <h2 style={{ display: "inline-block", marginRight: 10 }}>My Orders</h2>
          </div>

        </Col>
        {accountInfo()}
        {rowsMarkup}
      </Row>
    </>
  );
}
export default MyOrders;