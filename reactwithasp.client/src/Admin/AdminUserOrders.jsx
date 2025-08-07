import { useState, useEffect } from 'react';
import { useParams, NavLink } from "react-router";
import { useSelector, useDispatch } from 'react-redux'
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminUserOrders } from '@/features/admin/userorders/adminUserOrdersSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import '@/AdminUserOrders.css'

function AdminUserOrders() {
  const { usertype, idval } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const userOrders = useSelector(state => state.adminUserOrders.orders);

  useEffect(() => {
    fetchOrders();
  }, [idval]);

  async function fetchOrders() {
    setError("");
    //const path = ((usertype == "guest") ? "/api/admin-guest-orders/" : "/api/admin-user-orders/") + idval;
    const url = window.location.origin + "/api/admin-user-orders?idval=" + idval + "&usertype=" + usertype;
    axiosInstance.get(url).then((response) => {
      dispatch(setAdminUserOrders(response.data));
    })
    .catch((error) => {
      setError(error);
      dispatch(setAdminUserOrders([]));
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  const backLink = () => (
    <Row>
      <Col style={{ textAlign: 'left', marginBottom: 10 }}>
        <NavLink to={"/admin/orders"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', fontSize: 12 }}>
          <i className="bi bi-arrow-left-short"></i> Back
        </NavLink>
      </Col>
    </Row>
  );


  const orderRow = function (ord) {
    if (nullOrUndefined(ord)) {
      return (<></>);
    }
    return (
      <>
        <div key={ord.id} className="adminUserOrdersLiner">
          <Row className="OrderDetail">
            <Col xs={4}>Order ID</Col>          <Col xs={8}>{ord.id}</Col>
          </Row>
          <Row className="OrderDetail">
            <Col xs={4}>Order Status</Col>      <Col xs={8}>{ord.orderStatus}</Col>
          </Row>
          <Row className="OrderDetail">
            <Col xs={4}>Placed On</Col>         <Col xs={8}>{ord.orderPlacedDate}</Col>
          </Row>

          <Row className="OrderDetail">
            <Col xs={4}>Items</Col>             <Col xs={8}>{ord.itemString}</Col>
          </Row>
          <Row className="OrderDetail">
            <Col xs={4}>Quantity Total</Col>    <Col xs={8}>{ord.quantityTotal}</Col>
          </Row>
          <Row className="OrderDetail">
            <Col xs={4}>Price Total</Col>       <Col xs={8}>{ord.priceTotal}</Col>
          </Row>
        </div>
      </>
    );
  }

  const userOrdersMarkup = function () {
    return (
      <>
        <Row>
          <Col xs={0} lg={2}>
            {/*LSPACE*/}
          </Col>
          <Col xs={12} lg={8}>
            {backLink()}
            { userOrders.map(ord => orderRow(ord)) }
          </Col>
          <Col xs={0} lg={2}>
            {/*RSPACE*/}
          </Col>
        </Row>
      </>
    );
  }

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    userOrdersMarkup()
  ));

  return (
    <>
      <Row>
        <Col xs={12}>
          <AdminTitleBar titleText="Customer Account" construction={false} />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminUserOrders;