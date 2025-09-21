import { useSelector, useDispatch } from 'react-redux'
import { setAdminOrders } from '@/features/admin/orders/adminOrdersSlice.jsx'
import { setBacklogSearch } from '@/features/admin/orders/backlogSearch.jsx'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from "react-router";
import Table from 'react-bootstrap/Table'
import SearchInput from "@/Search/SearchInput";
import PaginationLinks from "@/Shop/PaginationLinks";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Spinner from 'react-bootstrap/Spinner';
import { axiosInstance } from '@/axiosDefault.jsx';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { nullOrUndefined } from '@/MgUtility.js';

import '@/AdminOrders.css'

function AdminOrders()
{
  const dispatch = useDispatch();
  const adminOrders = useSelector(state => state.adminOrders.lines);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { page } = useParams();
  const numPages = 6;
  const pageIntP = (page !== undefined) ? page : 1; // 1 = first page
  const myRoute = "/admin/orders/";

  const backlogSearch = useSelector(state => state.backlogSearch.value);
  const searchRevert = useSelector(state => state.backlogSearch.revert);

  useEffect(() => {
    dispatch(setBacklogSearch(""));
  }, []);

  useEffect(() => {
    fetchAdminOrders();
  }, [page, backlogSearch]);

  async function fetchAdminOrders()
  {
    console.log("Try to load Orders for /admin/orders page...");
    const bpage = (pageIntP === undefined) ? ("") : ("/" + pageIntP);
    const bs = backlogSearch.trim();
    const query = nullOrUndefined(bs) ? ("") : "?bs=" + encodeURIComponent(bs);
    const url = window.location.origin + "/api/admin-orders" + bpage + query;
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setAdminOrders(response.data.orders));
    })
    .catch((err) =>
    {
      if (err.status == 401) {
        console.log("User not logged in. Redirect to login page...");
        navigate('/admin');
      }
      else
      {
        if (err.response.data == 'Invalid search string'){
          dispatch(setBacklogSearch(searchRevert));
        }
        else if (err.response !== undefined){
          setError(err.response.data.errMessage);
        }
        else{
          setError("Something went wrong");
        }
      }
    })
    .finally(() => {
      console.log('Finished attempts to load records for /admin/orders page.');
    });
  }

  const handleClickBacklogRow = function (e) {
    if (e.currentTarget.tagName == "TR") {
      const orderid = e.currentTarget.dataset.orderid;
      if (orderid !== undefined) {
        navigate('/admin/order/' + orderid);
      }
    }
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

  const handleSearchChange = (str) => {
    dispatch(setBacklogSearch(str));
  };

  const pageMarkup = (
    <div className="adminOrderPMarkup">
      <div className="backlogSearchCont">
        <SearchInput parentHandleInputChange={handleSearchChange} initVal={backlogSearch} placeholder="Search backlog" />
      </div>
      {responsiveMessage}
      <div className="adminOrderPagin">
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
      </div>

      {/* Render the table if we have search results */}
      {adminOrders && adminOrders.length > 0 ? (

      <div className="wrapClearTable">
        <div className="wrapLeftClearTable"></div>
        <div className="wrapTable">
          <div className="wrapLeftTable"></div>
          <Table hover responsive className="adminOrdersTable">
            <thead>
              <tr>
                <th>OrderPlaced</th>
                <th>OrderID</th>
                <th>Username</th>
                <th>UserID</th>
                <th>GuestID</th>
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
              { adminOrders.map(line =>
                <tr key={line.id} className="backlogCursorRow" onClick={handleClickBacklogRow} data-orderid={line.id}>
                  <td>{line.orderPlacedDate}</td>
                  <td>{line.id}</td>
                  <td>{line.username}</td>
                  <td>{line.userIDshort}</td>
                  <td>{line.guestIDshort}</td>
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
          <div className="wrapLeftTable"></div>
        </div>
        <div className="wrapLeftClearTable"></div>
      </div>

      ):(
        // Display a message when no records are found
        <div style={{ display: "flex", justifyContent: "center" }}>No records found</div>
      )}

      <div className="adminOrderPagin">
        <PaginationLinks numPages={numPages} currPage={pageIntP} myRoute={myRoute} />
      </div>
    </div>
  );

  return (
    <Row>
      <Col sm={12} className="adminCont">

        <div className="adminOrdersOuter">
          <AdminTitleBar titleText="Orders Backlog" construction={false} />
          {error ? errMarkup : pageMarkup}
        </div>

        <div className="mgFooter" style={{ marginTop: 38 }}>Built with React / Redux and .NET Core 8.0</div>
      </Col>
    </Row>
  );
}
export default AdminOrders;