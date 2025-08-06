import { useState } from 'react';
import { useParams, NavLink } from 'react-router';
import { useSelector } from 'react-redux'
import Spinner from 'react-bootstrap/Spinner';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import '@/AdminOrder.css'

function AdminOrder ()
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { orderid } = useParams();
  const adminOrders = useSelector(state => state.adminOrders.lines);
  const adminOrder = adminOrders.find(ord => ord.id == orderid);

  const backLink = () => (
    <Row>
      <Col style={{ textAlign: 'left', marginBottom: 10 }}>
        <NavLink to={"/admin/orders"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', fontSize: 12 }}>
          <i className="bi bi-arrow-left-short"></i> Back
        </NavLink>
      </Col>
    </Row>
  );

  const pageMarkup = () => (
    <>
      <Row>
        <Col xs={0}  sm={1}  md={2} lg={3}></Col>
        <Col xs={12} sm={10} md={8} lg={6}>

          {backLink()}

          {/* 
          //  accountType            'Guest'
          //  email                  'email@address.com'
          //  id                     '120'
          //  items                  'Drink Bottle'
          //  itemsOrdered           '3'
          //  orderPlacedDate        '6/08/2025 7:22:25 PM +08:00'
          //  orderStatus            'OrderPlaced'
          //  outstanding            '60.00'
          //  paymentReceivedAmount  '0.00'
          //  userID                 '72699C8D.....................0C817A9'
          //  userIDshort            '72699C8D...'
          //  username               'FirstName LastName'
          */}

          <div className="AdminOrderDetailRow">
            <Row>
              <Col xs={6}>Order Number:</Col>  <Col xs={6}>{adminOrder.id}</Col>
              <Col xs={6}>User Name:</Col>
              <Col xs={6}>
                <NavLink to={"/admin/user/" + adminOrder.userID + "/edit"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                  {adminOrder.username}
                </NavLink>
              </Col>
              <Col xs={6}>User ID:</Col>           <Col xs={6}>{adminOrder.userID}</Col>
              <Col xs={6}>Account Type:</Col>      <Col xs={6}>{adminOrder.accountType}</Col>
              <Col xs={6}>email:</Col>             <Col xs={6}>{adminOrder.email}</Col>
              <Col xs={6}>orderPlacedDate:</Col>   <Col xs={6}>{adminOrder.orderPlacedDate}</Col>
              <Col xs={6}>paymentReceivedAmount:</Col> <Col xs={6}>{adminOrder.paymentReceivedAmount}</Col>
              <Col xs={6}>outstanding:</Col>       <Col xs={6}>{adminOrder.outstanding}</Col>
              <Col xs={6}>orderStatus:</Col>       <Col xs={6}>{adminOrder.orderStatus}</Col>
              <Col xs={6}>itemsOrdered:</Col>      <Col xs={6}>{adminOrder.itemsOrdered}</Col>
            </Row>
          </div>

          <div className="AdminOrderDetailRow">
            <Row>
              <Col xs={12}><b>Products:</b></Col>
              <br />
              <br />
              <Col xs={6}>items:</Col>             <Col xs={6}>{adminOrder.items}</Col>
              {/* Need to add orderedProducts to the adminOrder object and map thru them here. */}
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={1} md={2} lg={3}></Col>
      </Row>
    </>
  );

  const noOrderMarkup = function () {
    return (
      <>
        <h5 style={{ marginTop: 12 }}>(Not Found)</h5>
        <div style={{ height: 250 }}>
          &nbsp;
        </div>
      </>
    );
  }

  const loadingMarkup = function () {
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
    );
  }

  const errMarkup = (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {error && <span>Error: {error}</span>}
      </div>
    </>
  );

  const markup = ((adminOrder === undefined) ? noOrderMarkup() : pageMarkup());

  return (
    <>
      <AdminTitleBar titleText={"Order #" + orderid} construction={false} />
      {isLoading ? loadingMarkup() : (error ? errMarkup : markup )}
    </>
  );
}
export default AdminOrder;