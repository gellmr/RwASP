import { useSelector, useDispatch } from 'react-redux'
import { setAdminOrders } from '@/features/admin/orders/adminOrdersSlice.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useNavigate } from "react-router";
import ConstructionBanner from "@/main/ConstructionBanner.jsx";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function AdminOrders()
{
  const retryThisPage = 5;
  const dispatch = useDispatch();
  const adminOrders = useSelector(state => state.adminOrders.lines);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Configure axios instance.
  const axiosInstance = axios.create({
  });
  axiosRetry(axiosInstance, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  async function fetchAdminOrders()
  { 
    console.log("Try to load Orders for /admin/orders page...");
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-orders";
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setAdminOrders(response.data.orders));
    })
    .catch((err) => {
      if (err.status == 401) {
        console.log("User not logged in. Redirect to login page...");
        navigate('/admin'); // const reactRoute = err.response.headers.location; navigate(reactRoute);
      } else {
        if (err.response !== undefined) {
          setError(err.response.data.errMessage);
        } else {
          setError("Something went wrong");
        }
      }
    })
    .finally(() => {
      console.log('Finished attempts to load records for /admin/orders page.');
      // setError("Could not load records.");
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
          <Col key={line.id} xs={12} style={{ textAlign: "center", marginBottom: 20, border: "1px solid grey" }}>
            Order ID: {line.id} &nbsp;
            UserID: {line.userID} &nbsp;
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