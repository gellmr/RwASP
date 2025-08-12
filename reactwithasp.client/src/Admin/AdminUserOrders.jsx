import { useState, useEffect } from 'react';
import { useParams, NavLink } from "react-router";
import { useSelector, useDispatch } from 'react-redux'
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminUserOrders } from '@/features/admin/userorders/adminUserOrdersSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';
import BackLink from "@/Shop/BackLink";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import '@/AdminUserOrders.css'

function AdminUserOrders() {
  const { usertype, idval } = useParams();
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //const navigate = useNavigate();
  const dispatch = useDispatch();
  const userOrders = useSelector(state => state.adminUserOrders.orders);
  const userDisplayName = "Orders for " + fullname;

  const gotOrders = (!nullOrUndefined(userOrders) && Array.isArray(userOrders) && userOrders.length > 0) ? true : false;

  const whiteBackStyle = gotOrders ? "clearBack" : "whiteBack";
  const linerStyle = gotOrders ? "adminUserOrdersLiner whiteLiner" : "adminUserOrdersLiner";

  useEffect(() => {
    fetchOrders();
  }, [idval]);

  async function fetchOrders() {
    setError("");
    //const path = ((usertype == "guest") ? "/api/admin-guest-orders/" : "/api/admin-user-orders/") + idval;
    const url = window.location.origin + "/api/admin-user-orders?idval=" + idval + "&usertype=" + usertype;
    axiosInstance.get(url).then((response) => {
      setFullname(response.data.fullName);
      dispatch(setAdminUserOrders(response.data.orders));
    })
    .catch((error) => {
      setError(error);
      dispatch(setAdminUserOrders([]));
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  const orderRow = function (ord) {
    if (nullOrUndefined(ord)) {
      return (<></>);
    }
    return (
      <div key={ord.id} className={linerStyle}>
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
          <Col xs={4}>Quantity Total</Col>    <Col xs={8}>{ord.quantityTotal} <span style={{ color: '#919191' }}>Line items</span></Col>
        </Row>
        <Row className="OrderDetail">
          <Col xs={4}>Price Total</Col>       <Col xs={8}>${ord.priceTotal}</Col>
        </Row>
        <Row className="OrderDetail">
          <Col xs={12} style={{textAlign:'right'} }>
            <NavLink to={"/admin/order/" + ord.id} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
              View Details <i className="bi bi-arrow-right-short"></i>
            </NavLink>
          </Col>
        </Row>
      </div>
    );
  }


  const noOrdersMarkup = () => (
    <div style={{ height: 100, marginTop: 20 }}>
      <div className="noneAtMoment" >(None at the moment)</div>
      <BackLink textPos="center" />
    </div>
  );

  const yesOrdersMarkup = () => (
    <>
      <BackLink textPos="left" />
      <div className="wrapLiners">
        {userOrders.map(ord => orderRow(ord))}
      </div>
    </>
  );

  const userOrdersMarkup = function () {
    return (
      <>
        <Row>
          <Col xs={0} sm={1} md={2} lg={3}>
            {/*LSPACE*/}
          </Col>
          <Col xs={12} sm={10} md={8} lg={6}>
            {gotOrders ? yesOrdersMarkup() : noOrdersMarkup()}
          </Col>
          <Col xs={0} sm={1} md={2} lg={3}>
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
        <Col sm={12} className="adminCont adminParallax adminParallaxUserOrders" style={{paddingTop:0, paddingBottom:0}}>

          <Row className={whiteBackStyle}>
            <Col xs={12}>
              <AdminTitleBar titleText={userDisplayName} construction={false} />
            </Col>
            <Col xs={12}>
              {markup}
            </Col>
          </Row>

        </Col>
      </Row>
    </>
  );
}
export default AdminUserOrders;