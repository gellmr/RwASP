import { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyOrder } from '@/features/myOrder/myOrderSlice.jsx'
import Spinner from 'react-bootstrap/Spinner';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import { nullOrUndefined } from '@/MgUtility.js';
import Accordion from 'react-bootstrap/Accordion';
import BackLink from "@/Shop/BackLink";

import '@/AdminOrder.css'

function AdminOrder ()
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { orderid } = useParams();
  
  const myOrd = useSelector(state => state.myOrder.value);

  const guestFullName = (!nullOrUndefined(myOrd) && !nullOrUndefined(myOrd.guest))   ? myOrd.guest.fullName   : null;
  const fullName      = (!nullOrUndefined(myOrd) && !nullOrUndefined(myOrd.appUser)) ? myOrd.appUser.fullName : guestFullName;

  useEffect(() => {
    dispatch(fetchMyOrder({ orderid: parseInt(orderid) })); // Invoke thunk
  }, [orderid]);

  const orderDetailHeadMarkup = () => (
    <>
      <Col xs={12} className="myAdminOrdDetailTitleHead">
        <b>Items Ordered: </b>
      </Col>
      <Col xs={12}>
        <Row className='myAdminOrdDetailImageRow myAdminOrdDetailHead'>
          <Col xs={2} className='myAdminOrdDetailImageCell'>Price</Col>
          <Col xs={3} className='myAdminOrdDetailImageCell myAdminOrdDetailIspTitle'>Description</Col>
          <Col xs={2} className='myAdminOrdDetailImageCell'>Qty</Col>
          <Col xs={2} className='myAdminOrdDetailImageCell'>Subtot</Col>
          <Col xs={3} className='myAdminOrdDetailImageCell' style={{ textAlign: 'center' }}>&nbsp;</Col>
        </Row>
      </Col>
    </>
  );

  const orderDetailFootMarkup = () => (
    <>
      <Col xs={12} className='myAdminOrdDetailFoot'>
        <Row className=''>
          <Col xs={5} className='myAdminOrdDetailImageCell' style={{textAlign:'left'}}>Total:</Col>
          <Col xs={2} className='myAdminOrdDetailImageCell'>{myOrd.quantityTotal}</Col>
          <Col xs={2} className='myAdminOrdDetailImageCell grandTotal'>${myOrd.priceTotal}</Col>
          <Col xs={3} className='myAdminOrdDetailImageCell' style={{ textAlign: 'center' }}>&nbsp;</Col>
        </Row>
      </Col>
    </>
  );

  const orderDetailMarkup = function ()
  {
    if (myOrd === undefined || myOrd === null || myOrd.orderedProducts === undefined || myOrd.orderedProducts.length == 0) {
      return <></>;
    }
    return (
      <Col xs={12}>
        {myOrd.orderedProducts.map(op =>
          <Row key={op.id} className='myAdminOrdDetailImageRow'>
            <Col xs={2} className='myAdminOrdDetailImageCell'>
              <span className='mgLight' >${op.inStockProduct.price}</span>
              <br />
            </Col>

            <Col xs={3} className='myAdminOrdDetailImageCell myAdminOrdDetailIspTitle'>
              <b>{op.inStockProduct.title}</b>
            </Col>

            <Col xs={2} className='myAdminOrdDetailImageCell'>
              <span className='mgLight'>{op.quantity}</span>
              <br />
            </Col>

            <Col xs={2} className='myAdminOrdDetailImageCell'>
              <span className='mgLight'>${op.inStockProduct.price * op.quantity}</span>
            </Col>

            <Col xs={3} className='myAdminOrdDetailImageCell' style={{ textAlign: 'center' }}>
              <Image src={op.inStockProduct.image} rounded style={{ width: 35 }} /> &nbsp;
            </Col>
          </Row>
        )}
      </Col>
    );
  }

  const pageMarkup = function ()
  {
    if (myOrd === undefined || myOrd === null) {
      return <></>;
    }
    const idSeg = (myOrd.accountType === "User") ? (myOrd.userID) : (myOrd.guestID);
    const editPathSeg = (myOrd.accountType === "User") ? "user" : "guest";
    const editPath = "/admin/" + editPathSeg + "/" + idSeg + "/edit";

    return (
      <>
        <Row id="adminOrderPage">
          <Col xs={0} sm={1} md={2} lg={3}></Col>
          <Col xs={12} sm={10} md={8} lg={6}>

            <BackLink textPos="left" />

            <div className="AdminOrderDetailRow AdminOrderDetailHeader">
              <Row>
                <Col xs={5}>Order Number:</Col>  <Col xs={7}>{myOrd.id}</Col>
              </Row>
              <Row>
                <Col xs={5}>Order Placed:</Col>   <Col xs={7}>{myOrd.orderPlacedDate}</Col>
              </Row>
              <Row>
                <Col xs={5}>Order Total:</Col>       <Col xs={7}>${myOrd.priceTotal}</Col>
              </Row>
              <Row>
                <Col xs={5}>Items Ordered:</Col>      <Col xs={7}>{myOrd.quantityTotal}</Col>
              </Row>
              <Row>
                <Col xs={5}>Order Status:</Col>       <Col xs={7}>{myOrd.orderStatus}</Col>
              </Row>

              <Row>
                <Col xs={5}>Customer Name:</Col>
                <Col xs={7}>
                  <NavLink to={editPath} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
                    {fullName}
                  </NavLink>
                </Col>
              </Row>
              <Row>
                <Col xs={5}>Account Type:</Col>      <Col xs={7}>{myOrd.accountType}</Col>
              </Row>

              <Row><Col xs={5}>&nbsp;</Col><Col xs={7}>&nbsp;</Col></Row>

              <Row style={{ color: '#6873df', fontWeight: 400 }}>
                <Col xs={5}>Payment Received:</Col> <Col xs={7}>${myOrd.priceTotal - myOrd.outstanding}</Col>
              </Row>
              <Row style={{ color: '#ff8000', fontWeight: 500 }}>
                <Col xs={5}>Outstanding:</Col>       <Col xs={7}>${myOrd.outstanding}</Col>
              </Row>
            </div>

            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>User Details</Accordion.Header>
                <Accordion.Body className="collapseDeet">
                  <Row>
                    <Col xs={5}>User Name:</Col>         <Col xs={7}>{myOrd.userOrGuestName}</Col>
                  </Row>
                  <Row>
                    <Col xs={5}>email:</Col>             <Col xs={7}>{myOrd.userOrGuestEmail}</Col>
                  </Row>
                  <Row>
                    <Col xs={5}>User ID:</Col>           <Col xs={7} style={{ color: '#94a7ba' }}>{myOrd.userID}</Col>
                  </Row>
                  <Row>
                    <Col xs={5}>Guest ID:</Col>          <Col xs={7} style={{ color: '#94a7ba' }}>{myOrd.guestID}</Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="AdminOrderDetailRow">
              <Row>
                {orderDetailHeadMarkup()}
                {myOrd !== undefined ? orderDetailMarkup() : ''}
                {orderDetailFootMarkup()}
              </Row>
            </div>

            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Shipping Details</Accordion.Header>
                <Accordion.Body className="collapseDeet">
                  <Row>
                    <Col xs={12}>{myOrd.shippingAddress}</Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Billing Details</Accordion.Header>
                <Accordion.Body className="collapseDeet">
                  <Row>
                    <Col xs={12}>{myOrd.billingAddress}</Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
          <Col xs={0} sm={1} md={2} lg={3}></Col>
        </Row>
      </>
    );
  }

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

  const markup = ((myOrd === undefined) ? noOrderMarkup() : pageMarkup());

  return (
    <>
      <AdminTitleBar titleText={"Order #" + orderid} construction={false} />
      {isLoading ? loadingMarkup() : (error ? errMarkup : markup )}
    </>
  );
}
export default AdminOrder;