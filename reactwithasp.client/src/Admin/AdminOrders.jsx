import { useSelector, useDispatch } from 'react-redux'
import { setAdminOrders } from '@/features/admin/orders/adminOrdersSlice.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ConstructionBanner from "@/main/ConstructionBanner.jsx";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function AdminOrders()
{
  const dispatch = useDispatch();
  const adminOrders = useSelector(state => state.adminOrders.lines);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Configure axios instance.
  axiosRetry(axios, { retries: 7, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  async function fetchAdminOrders()
  { 
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-orders";
    const jsonData = {};
    axios.post(url, jsonData).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setAdminOrders(response.data.orders));
    })
    .catch((err) => {
      setError(err.response.data.errMessage);
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const errMarkup = (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {error && <span>Error: {error}</span>}
      </div>
    </>
  );

  const loadingMarkup = (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="fetchErr">Loading...</div>
      </div>
    </>
  );

  const pageMarkup = (
    <>
      <Row>
        {adminOrders && adminOrders.length > 0 && adminOrders.map(line =>
          <Col xs={12} style={{textAlign:"left"}}>
            Order ID: {line.id} <br />
            UserID: {line.userID} <br />
            OrderPlacedDate: {line.orderPlacedDate} <br />
          </Col>
        )}
      </Row>
    </>
  );

  return (
    <>
      <h4>Admin Orders</h4>
      <ConstructionBanner />
      {isLoading ? loadingMarkup : (error ? errMarkup : pageMarkup)}
    </>
  );
}
export default AdminOrders;