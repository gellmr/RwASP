import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NavLink } from "react-router";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import AdminTitleBar from "@/Admin/AdminTitleBar";
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
  const guestID = useSelector(state => state.login.guest);
  const loginValue = useSelector(state => state.login.value);

  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  // "Guest" | "User" | null
  const accType = !nullOrUndefined(guestID) ? "Guest" : (!nullOrUndefined(loginValue) ? "User"   : null );
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
      <h5 style={{ marginTop: 12 }}>(None at the moment)</h5>
      <div style={{ height:250 }}>
        &nbsp;
      </div>
    </>
  );

  const rowsMarkup =
    (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    (!ordersThisPage) ? <div className="fetchErr">( Could not find any Orders! )</div> : (
    (ordersThisPage.length === 0) ? noOrdersMarkup() : (
    ordersThisPage && ordersThisPage.map(ord =>
      <Col xs={12} key={ord.id}>
        <div className="myOrdersTable">
          <table style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              <tr>
                <td>Order Number</td>
                <td style={{ fontWeight:600 }}>{ord.id}</td>
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

              <tr className="myOrdersAccTypeSection">
                <td>Account Type</td>
                <td>{accType}</td>
              </tr>
              <tr>
                <td>{accType} ID</td>
                <td>{idval}</td>
              </tr>

              <tr>
                <td></td>
                <td style={{ textAlign: 'right', paddingBottom:15 }}>
                  <NavLink to={"/myorders/" + ord.id} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                    View Details <i className="bi bi-arrow-right-short"></i>
                  </NavLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
    )
  ))));

  return (
    <>
      <Row>
        <Col xs={12}>
          <AdminTitleBar titleText="My Orders" construction={false} />
        </Col>
        {rowsMarkup}
      </Row>
    </>
  );
}
export default MyOrders;