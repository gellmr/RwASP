import { useState, useEffect } from 'react';
import { useParams, NavLink } from "react-router";
import { useSelector, useDispatch } from 'react-redux'
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminUserOrders } from '@/features/admin/userorders/adminUserOrdersSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
        <NavLink to={"/admin/useraccounts"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', fontSize: 12 }}>
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
        <Row key={ord.id} className="">

          <Col xs={12}>{ord.id}</Col>
          <Col xs={12}>{ord.orderStatus}</Col>
          <Col xs={12}>{ord.orderPlacedDate}</Col>

          <Col xs={12}>{ord.itemString}</Col>
          <Col xs={12}>{ord.quantityTotal}</Col>
          <Col xs={12}>{ord.priceTotal}</Col>

        </Row>
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