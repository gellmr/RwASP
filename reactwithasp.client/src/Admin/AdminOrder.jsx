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
          <div className="AdminOrderDetailRow">
            <Row className="">
              <Col xs={6}>Order Number:</Col>  <Col xs={6}>{adminOrder.id}</Col>
            </Row>
            <Row className="">
              <Col xs={6}>User Name:</Col>
              <Col xs={6}>
                <NavLink to={"/admin/user/" + adminOrder.userID + "/edit"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                  {adminOrder.username}
                </NavLink>
              </Col>
            </Row>
            <Row className="">
              <Col xs={6}>User ID:</Col>       <Col xs={6}>{adminOrder.userID}</Col>
            </Row>
            <Row className="">
              <Col xs={6}>Account Type:</Col>  <Col xs={6}>{adminOrder.accountType}</Col>
            </Row>
          </div>

          <div className="AdminOrderDetailRow">
            <Row className="">
              <Col xs={12}>Products:</Col>
            </Row>
            <Row className="">
              <Col xs={6}>ID:</Col>      <Col xs={6}>XXX</Col>
              <Col xs={6}>ID:</Col>      <Col xs={6}>XXX</Col>
              <Col xs={6}>ID:</Col>      <Col xs={6}>XXX</Col>
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={1} md={2} lg={3}></Col>
      </Row>
    </>
  );

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
        <div className="fetchErr">
          <Spinner animation="border" size="sm" />
          &nbsp;
          Loading
        </div>
      </div>
    </>
  );

  const noOrderMarkup = (
    <>
      <h5 style={{ marginTop: 12 }}>(Not Found)</h5>
      <div style={{ height: 250 }}>
        &nbsp;
      </div>
    </>
  );

  const markup = ((adminOrder === undefined) ? noOrderMarkup() : pageMarkup());

  return (
    <>
      <AdminTitleBar titleText={"Order #" + adminOrder.id} construction={false} />
      {isLoading ? loadingMarkup() : (error ? errMarkup : markup)}
    </>
  );
}
export default AdminOrder;