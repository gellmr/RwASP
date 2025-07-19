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

  const rowsMarkup =
    (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    (!ordersThisPage || ordersThisPage.length === 0) ? <div className="fetchErr">( Could not find any Orders! )</div> : (
    ordersThisPage && ordersThisPage.map(ord =>
      <Col xs={12} key={ord.id}>
        <div>Order #{ord.id}</div>
      </Col>
    )
  )));

  return (
    <>
      <Row style={{height:650}}>
        <Col xs={12}>
          <AdminTitleBar titleText="My Orders" />
        </Col>
        {rowsMarkup}
      </Row>
    </>
  );
}
export default MyOrders;