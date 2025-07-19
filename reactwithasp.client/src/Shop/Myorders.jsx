import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios';
import axiosRetry from 'axios-retry';

import { setMyOrders } from '@/features/myOrders/myOrdersSlice.jsx'
import AdminTitleBar from "@/Admin/AdminTitleBar";

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
      <h5>(None at the moment)</h5>
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
          <table style={{ width: "100%", textAlign:"left" }}>
            <tr>
              <td>Order Number</td>
              <td>{ord.id}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{ord.orderStatus}</td>
            </tr>
            <tr>
              <td>Placed Date</td>
              <td>{ord.orderPlacedDate}</td>
            </tr>
          </table>
        </div>
      </Col>
    )
  ))));

  return (
    <>
      <Row style={{minHeight:180}}>
        <Col xs={12}>
          <AdminTitleBar titleText="My Orders" />
        </Col>
        {rowsMarkup}
      </Row>
    </>
  );
}
export default MyOrders;