import { useSelector, useDispatch } from 'react-redux'
import { setAdminOrders } from '@/features/admin/orders/adminOrdersSlice.jsx'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from "react-router";
import Table from 'react-bootstrap/Table'
import PaginationLinks from "@/Shop/PaginationLinks";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Spinner from 'react-bootstrap/Spinner';

import { axiosInstance } from '@/axiosDefault.jsx';

function AdminOrders()
{
  const dispatch = useDispatch();
  const adminOrders = useSelector(state => state.adminOrders.lines);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { page } = useParams();
  const numPages = 6;
  const pageIntP = (page !== undefined) ? page : 1; // 1 = first page
  const myRoute = "/admin/orders/";

  useEffect(() => {
    fetchAdminOrders();
  }, [page]);

  async function fetchAdminOrders()
  { 
    console.log("Try to load Orders for /admin/orders page...");
    setError("");
    setIsLoading(true);
    const query = (pageIntP !== undefined) ? "/" + pageIntP : "";
    const url = window.location.origin + "/api/admin-orders" + query;
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setAdminOrders(response.data.orders));
    })
    .catch((err) => {
      if (err.status == 401) {
        console.log("User not logged in. Redirect to login page...");
        navigate('/admin');
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

  const loadingMarkup = function () {
    if (adminOrders && adminOrders.length > 0) {
      return pageMarkup; // Render the current page while we are waiting for the new one to load...
    }
    return (
      <>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="fetchErr">
            <Spinner animation="border" size="sm" />
            &nbsp;
            Loading
          </div>
        </div>
      </>
    )
  };

  const responsiveMessage = (
    <span className="d-inline-block d-lg-none d-xl-none responsiveScrollsRight">( Responsive table scrolls right )&nbsp;<i className="bi bi-arrow-right"></i></span>
  );

  const pageMarkup = (
    <>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
      </div>
      <Table hover responsive>
        <thead>
          <tr>
            <th>OrderPlaced</th>
            <th>OrderID</th>
            <th>Username</th>
            <th>UserID</th>
            <th>AccountType</th>
            <th>Email</th>
            <th>PaymentReceived</th>
            <th>Outstanding</th>
            <th>ItemsOrdered</th>
            <th style={{textAlign:"left"}}>Items</th>
            <th>OrderStatus</th>
          </tr>
        </thead>
        <tbody>
          {adminOrders && adminOrders.length > 0 && adminOrders.map(line =>
            <tr key={line.id}>
              <td>{line.orderPlacedDate}</td>
              <td>{line.id}</td>
              <td>{line.username}</td>
              <td>{line.userIDshort}</td>
              <td>{line.accountType}</td>
              <td>{line.email}</td>
              <td>{line.paymentReceivedAmount}</td>
              <td>{line.outstanding}</td>
              <td>{line.itemsOrdered}</td>
              <td style={{textAlign:"left"}}>{line.items}</td>
              <td>{line.orderStatus}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
      </div>
    </>
  );

  return (
    <>
      <AdminTitleBar titleText="Orders Backlog" construction={false}>
        {responsiveMessage}
      </AdminTitleBar>

      {isLoading ? loadingMarkup() : (error ? errMarkup : pageMarkup)}
    </>
  );
}
export default AdminOrders;