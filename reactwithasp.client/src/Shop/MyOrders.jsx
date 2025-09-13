import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NavLink, useParams } from "react-router";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import displayDate from '@/Shop/displayDate.jsx';
import { fetchMyOrders } from '@/features/myOrders/myOrdersSlice.jsx';
import { nullOrUndefined, oneLineAddress } from '@/MgUtility.js';
import PaginationLinks from "@/Shop/PaginationLinks";
import MyOrdersShowAccountInfo from '@/Shop/MyOrdersShowAccountInfo.jsx';
import { useMyOrdersAccountInfoProps } from '@/Shop/useMyOrdersAccountInfoProps';

import '@/MyOrders.css'

const MyOrders = () =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { page } = useParams();
  const dispatch = useDispatch();
  const ordersThisPage = useSelector(state => state.myOrders.value);
  const loginValue = useSelector(state => state.login.user);
  const { fullname, email, accType, idval, myUserId, guestID, devMode } = useMyOrdersAccountInfoProps();
  const emptyMsgText1 = (myUserId) ? "(Logged in as " + loginValue.fullname + ")" : "(None at the moment)";
  const emptyMsgText2 = (myUserId) ? "You currently have no orders" : '';

  useEffect(() => {
    if (!nullOrUndefined(ordersThisPage) && Array.isArray(ordersThisPage)) {
      // Finished loading
      setIsLoading(false);
    } else {
      // Initiate loading
      dispatch(fetchMyOrders({ uid: myUserId, gid: guestID })); // Invoke thunk
      setIsLoading(true);
    }
  }, [ordersThisPage, myUserId, guestID]);

  const noOrdersMarkup = () => (
    <>
      <div className="ordersEmptyMsg">
        <div>{emptyMsgText1}</div>
        <div>{emptyMsgText2}</div>
      </div>
      <div style={{ height:250 }}>
        &nbsp;
      </div>
    </>
  );

  const orderRow = function (ord)
  {
    const shipAddy = !nullOrUndefined(ord.shippingAddress) ? ord.shippingAddress : oneLineAddress(ord.shipAddress);
    let bill       = !nullOrUndefined(ord.billingAddress)  ? ord.billingAddress  : oneLineAddress(ord.billAddress);
    const billAddy = (bill === shipAddy) ? "(same as shipping address)" : bill;
    
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
                  <Col xs={8} sm={9} className="shipToDetail">{shipAddy}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className="">Billing Address:</Col>
                  <Col xs={8} sm={9} className="shipToDetail">{billAddy}</Col>
                </Row>
              </Col>

              <Col xs={12} className="myOrdRow">
                <Row>
                  <Col xs={4} sm={3} className=""></Col>
                  <Col xs={8} sm={9} style={{textAlign:'right', paddingBottom:10, paddingRight:25}}>
                    <NavLink to={"/myorder/" + ord.id} className="btn btn-light myOrdViewDetBtn" style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
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

  const mapOrders = function (ordersThisPage) {
    const ordersPerPage = 3;
    const ordersCount = ordersThisPage.length;
    const wholePages = Math.floor(ordersCount / ordersPerPage); // eg 10 / 3 == 3
    const extraLines = ordersCount % ordersPerPage;             // eg 10 % 3 == 1
    const extraPage = (extraLines == 0 ? 0 : 1);                // eg 1 if there are extraLines
    const numPages = wholePages + extraPage;
    const pageIntP = nullOrUndefined(page) ? 1 : page;
    const myRoute = "/myorders/";
    const startIndex = (pageIntP - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToDisplay = ordersThisPage.slice(startIndex, endIndex); // Get only the orders for the current page
    return (
      <div className="myOrdersLines" style={{ marginTop: 10 }}>
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
        <div style={{ marginBottom: 10 }}>
          {ordersThisPage && ordersToDisplay.map(ord => orderRow(ord))}
        </div>
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
      </div>
    );
  }

  const rowsMarkup =
    (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    (!ordersThisPage) ? <div className="fetchErr">( Could not find any Orders! )</div> : (
    (ordersThisPage.length === 0) ? noOrdersMarkup() : mapOrders(ordersThisPage)
  )));

  const accountInfo = function () {
    if (!ordersThisPage || ordersThisPage.length === 0) {
      return (<></>);
    }
    return (
      <MyOrdersShowAccountInfo accType={accType} idval={idval} fullname={fullname} email={email} devMode={devMode} />
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