import { useParams } from 'react-router';
import { useSelector } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';

import axios from 'axios';
import axiosRetry from 'axios-retry';

import displayDate from '@/Shop/displayDate.jsx'
import AdminTitleBar from "@/Admin/AdminTitleBar";

function MyOrderDetail()
{
  const retryThisPage = 5;
  
  // Configure axios instance.
  axiosRetry(axios, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  const { orderid } = useParams();
  const orders = useSelector(state => state.myOrders.value);
  const ord = (orders && orders.length > 0) && orders.find(o => o.id.toString() === orderid);
  
  const noOrderMarkup = () => (
    <>
      <h5 style={{ marginTop: 12 }}>(No Order ID)</h5>
      <div style={{ height: 250 }}>
        &nbsp;
      </div>
    </>
  );

  const markup = (ord === undefined) ? noOrderMarkup() : (
    <Col xs={12} key={ord.id}>
      <div className="myOrdersTable">

        <Row>
          <Col>
            <table style={{ width: "100%", textAlign: "left" }}>
              <tbody>
                <tr>
                  <td>Order Number</td>
                  <td style={{ fontWeight: 600 }}>{ord.id}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{ord.orderStatus}</td>
                </tr>
                <tr>
                  <td>Placed Date</td>
                  <td>
                    {displayDate(ord.orderPlacedDate)}
                  </td>
                </tr>
                <tr>
                  <td>Price Total</td>
                  <td>$ {ord.priceTotal}</td>
                </tr>
                <tr>
                  <td>Total Items</td>
                  <td>{ord.quantityTotal}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <hr />

        <Row>
          <Col xs={12} style={{marginBottom:10}}>
            <Row className='myOrdDetailImageRows'>
              <Col xs={4} className='myOrdDetailImageCell'>
                <b>Title</b>
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
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {ord.orderedProducts && ord.orderedProducts.map(op =>
              <Row className='myOrdDetailImageRows'>
                <Col xs={4} className='myOrdDetailImageCell'>
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
          </Col>
        </Row>

      </div>
    </Col>
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <AdminTitleBar titleText={"Order Number: " + orderid} construction={false} />
        </Col>
        {markup}
      </Row>
    </>
  );
}
export default MyOrderDetail;