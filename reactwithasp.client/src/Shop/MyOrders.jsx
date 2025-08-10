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

  const devMode = (import.meta.env.DEV); // true if environment is development

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
        <div className="myOrdersRect">
          <Row>
            <Col xs={12}>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Order Number</Col>
                  <Col xs={8} sm={9} className="" style={{ fontWeight: 600 }}>{ord.id}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Status</Col>
                  <Col xs={8} sm={9} className="">{ord.orderStatus}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Placed Date</Col>
                  <Col xs={8} sm={9} className="">{displayDate(ord.orderPlacedDate)}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Items</Col>
                  <Col xs={8} sm={9} className="">{ord.itemString}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Total Items</Col>
                  <Col xs={8} sm={9} className="">{ord.quantityTotal}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Price Total</Col>
                  <Col xs={8} sm={9} className="">$ {ord.priceTotal}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Ship To:</Col>
                  <Col xs={8} sm={9} className="shipToDetail">{ord.shippingAddress}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className=""></Col>
                  <Col xs={8} sm={9} style={{textAlign:'right', paddingBottom:10, paddingRight:25}}>
                    <NavLink to={"/myorders/" + ord.id} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                      View Details <i className="bi bi-arrow-right-short"></i>
                    </NavLink>
                  </Col>
                </Row>
              </Col>

            </Col>
          </Row>
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

  const devShowAccountId = function () {
    return (
      <Col xs={12} className="myOrdRow">
        <Row>
          <Col xs={4} sm={3} className="">{accType} ID:</Col>
          <Col xs={8} sm={9} className="guid">{idval}</Col>
        </Row>
      </Col>
    );
  }

  const accountInfo = function () {
    if (!ordersThisPage || ordersThisPage.length === 0) {
      return (<></>);
    }
    return (
      <Col xs={12}>
        <div className="myOrdersRect myOrdersHeadInfo">
          <Row>
            <Col xs={12}>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Account Type:</Col>
                  <Col xs={8} sm={9} className="">{accType}</Col>
                </Row>
              </Col>

              {devMode && devShowAccountId()}

              <Col xs={12} className="myOrdRow" style={{marginBottom:15}}>
                <Row>
                  <Col xs={4} sm={3} className="">Full Name:</Col>
                  <Col xs={8} sm={9} className="">{fullname}</Col>
                </Row>
              </Col>
            </Col>
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