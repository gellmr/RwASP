import { useParams } from 'react-router';
import { useSelector } from 'react-redux'
import { Link } from "react-router";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import displayDate from '@/Shop/displayDate.jsx'
import AdminTitleBar from "@/Admin/AdminTitleBar";
import BackLink from "@/Shop/BackLink";
import { nullOrUndefined, oneLineAddress } from '@/MgUtility.js';
import MyOrdersShowAccountInfo from '@/Shop/MyOrdersShowAccountInfo.jsx';
import { useMyOrdersAccountInfoProps } from '@/Shop/useMyOrdersAccountInfoProps';

import '@/MyOrderDetail.css'

function MyOrderDetail()
{
  const { orderid } = useParams();
  const orders = useSelector(state => state.myOrders.value);
  const ord = (orders && orders.length > 0) && orders.find(o => o.id.toString() === orderid);
  const shipAddy = !nullOrUndefined(ord.shippingAddress) ? ord.shippingAddress : oneLineAddress(ord.shipAddress);
  let bill = !nullOrUndefined(ord.billingAddress) ? ord.billingAddress : oneLineAddress(ord.billAddress);
  const billAddy = (bill === shipAddy) ? "(same as shipping address)" : bill;
  const { fullname, email, accType, idval, myUserId, guestID, devMode } = useMyOrdersAccountInfoProps();

  const noOrderMarkup = () => (
    <>
      <h5 style={{ marginTop: 12 }}>(No Order ID)</h5>
      <div style={{ height: 250 }}>
        &nbsp;
      </div>
    </>
  );

  const accountInfo = function (){
    return (
      <MyOrdersShowAccountInfo accType={accType} idval={idval} fullname={fullname} email={email} devMode={devMode} />
    );
  }

  const markup = (ord === undefined) ? noOrderMarkup() : (
    <Col xs={12} key={ord.id}>

      <div className="myOrdDetailImageHead">
        <Row>
          <Col xs={12}>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Order Number</Col>
                <Col xs={9} className="" style={{ fontWeight: 600 }}>{ord.id}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Status</Col>
                <Col xs={9} className="">{ord.orderStatus}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Placed Date</Col>
                <Col xs={9} className="">{displayDate(ord.orderPlacedDate)}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Price Total</Col>
                <Col xs={9} className="">$ {ord.priceTotal}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Total Items</Col>
                <Col xs={9} className="">{ord.quantityTotal}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Ship to:</Col>
                <Col xs={9} className="shipAddy">{shipAddy}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdDetailRow">
              <Row>
                <Col xs={3} className="">Billing Address:</Col>
                <Col xs={9} className="shipAddy">{billAddy}</Col>
              </Row>
            </Col>

          </Col>
        </Row>
      </div>

      <Row>
        <Col xs={12}  style={{paddingBottom:10, paddingTop:10}}>

          <div className='myOrdDetailImageBody'>

            <Row className='myOrdDetailImageRow'>
              <Col xs={2} className='myOrdDetailImageCell'>
                <b>Price</b>
              </Col>
              <Col xs={3} className='myOrdDetailImageCell'>
                <b>Item</b>
              </Col>
              <Col xs={2} className='myOrdDetailImageCell'>
                <b>Qty</b>
              </Col>
              <Col xs={2} className='myOrdDetailImageCell'>
                <b>Total</b>
              </Col>
              <Col xs={3} className='myOrdDetailImageCell' style={{ textAlign: 'center' }}>
                {/*Image*/}
              </Col>
            </Row>
            <hr />

            {ord.orderedProducts && ord.orderedProducts.map(op =>
              <Row key={op.id} className='myOrdDetailImageRow'>

                <Col xs={2} className='myOrdDetailImageCell'>
                  <span className='mgLight' >${op.inStockProduct.price}</span>
                  <br />
                </Col>

                <Col xs={3} className='myOrdDetailImageCell myOrdDetailIspTitle'>
                  <b>{op.inStockProduct.title}</b>
                </Col>

                <Col xs={2} className='myOrdDetailImageCell'>
                  <span className='mgLight'>{op.quantity}</span>
                  <br />
                </Col>

                <Col xs={2} className='myOrdDetailImageCell'>
                  <span className='mgLight'>${op.inStockProduct.price * op.quantity}</span>
                </Col>

                <Col xs={3} className='myOrdDetailImageCell' style={{ textAlign:'center' }}>
                  <Image src={op.inStockProduct.image} rounded style={{ width: 35 }} /> &nbsp;
                </Col>
              </Row>
            )}

            {/*<hr style={{ margin:0, marginBottom:10 }} />*/}

            <Row className='myOrdDetailImageRow'>
              <Col xs={2} className='myOrdDetailImageCell'>
                &nbsp;
              </Col>
              <Col xs={3} className='myOrdDetailImageCell'>
                &nbsp;
              </Col>
              <Col xs={2} className='myOrdDetailImageCell'>
                {ord.quantityTotal}
              </Col>
              <Col xs={2} className='myOrdDetailImageCell'>
                $<b>
                  {ord.priceTotal}
                </b>
              </Col>
              <Col xs={3} className='myOrdDetailImageCell' style={{ textAlign: 'center' }}>
                &nbsp;
              </Col>
            </Row>

          </div>
        </Col>
      </Row>

    </Col>
  );

  return (
    <>
      <Row id="myOrdDetailPage">
        <Col xs={12} style={{marginBottom:6}}>
          <AdminTitleBar titleText={"Order #" + orderid} construction={false} />
        </Col>
        {accountInfo()}
        <div className="myOrderDetailLines">
          <BackLink textPos="left" />
          {markup}
        </div>
      </Row>
    </>
  );
}
export default MyOrderDetail;