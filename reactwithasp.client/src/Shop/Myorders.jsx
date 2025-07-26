import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { NavLink } from "react-router";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios';
import axiosRetry from 'axios-retry';

import { setMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import AdminTitleBar from "@/Admin/AdminTitleBar";

import displayDate from '@/Shop/displayDate.jsx'

import '@/MyOrders.css'

const MyOrders = () =>
{
  const retryThisPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios instance.
  axiosRetry(axios, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  const ordersThisPage = useSelector(state => state.myOrders.value);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  async function fetchMyOrders()
  {
    const url = window.location.origin + "/api/myorders";
    console.log("Axios retry..." + url);
    axios.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setMyOrders(response.data));
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      dispatch(setMyOrders( [] ));
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

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