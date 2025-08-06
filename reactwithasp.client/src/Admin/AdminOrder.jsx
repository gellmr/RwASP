import { useState } from 'react';
import { useParams } from 'react-router';
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

  const pageMarkup = (
    <Row>
      <Col xs={0}  sm={1}  md={2} lg={3}></Col>
      <Col xs={12} sm={10} md={8} lg={6}>

        <div className="AdminOrderDetailRow">
          <Row className="">
            <Col xs={6}>Order Number:</Col>  <Col xs={6}>{adminOrder.id}</Col>
          </Row>
          <Row className="">
            <Col xs={6}>User Name:</Col>     <Col xs={6}>{adminOrder.username}</Col>
          </Row>
          <Row className="">
            <Col xs={6}>User ID:</Col>       <Col xs={6}>{adminOrder.userID}</Col>
          </Row>
          <Row className="">
            <Col xs={6}>Account Type:</Col>  <Col xs={6}>{adminOrder.accountType}</Col>
          </Row>
        </div>

      </Col>
      <Col xs={0} sm={1} md={2} lg={3}></Col>
    </Row>
  );

  const errMarkup = (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {error && <span>Error: {error}</span>}
      </div>
    </>
  );

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
    )
  };

  return (
    <>
      <AdminTitleBar titleText="Order Details" construction={true} />
      {isLoading ? loadingMarkup() : (error ? errMarkup : pageMarkup)}
    </>
  );
}
export default AdminOrder;