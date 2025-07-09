import { useSelector, useDispatch } from 'react-redux'
import { setAdminOrders } from '@/features/admin/orders/adminOrdersSlice.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useNavigate } from "react-router";
import ConstructionBanner from "@/main/ConstructionBanner.jsx";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

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
      <Table striped bordered hover responsive style={{fontSize:8}}>
        <thead>
          <tr>
            <th>OrderID</th>
            <th>Username</th>
            <th>UserID</th>
            <th>AccountType</th>
            <th>Email</th>
            <th>OrderPlaced</th>
            <th>PaymentReceived</th>
            <th>Outstanding</th>
            <th>ItemsOrdered</th>
            <th>Items</th>
            <th>OrderStatus</th>
          </tr>
        </thead>
        <tbody>
          {adminOrders && adminOrders.length > 0 && adminOrders.map(line =>
            <tr>
              <td>{line.id}</td>
              <td>{line.username}</td>
              <td>{line.userID}</td>
              <td>{line.accountType}</td>
              <td>{line.email}</td>
              <td>{line.orderPlacedDate}</td>
              <td>{line.paymentReceivedAmount}</td>
              <td>{line.outstanding}</td>
              <td>{line.itemsOrdered}</td>
              <td>{line.items}</td>
              <td>{line.orderStatus}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );

  return (
    <>
      <h4>Orders Backlog</h4>
      <ConstructionBanner />
      {isLoading ? loadingMarkup : (error ? errMarkup : pageMarkup)}
    </>
  );
}
export default AdminOrders;