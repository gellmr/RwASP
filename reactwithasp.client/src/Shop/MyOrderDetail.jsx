import { useParams } from 'react-router';
import { useSelector } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import displayDate from '@/Shop/displayDate.jsx'
import AdminTitleBar from "@/Admin/AdminTitleBar";

import '@/MyOrderDetail.css'

function MyOrderDetail()
{
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

      <div className="myOrdDetailImageHead">
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
                  <td style={{ verticalAlign:'top' }}>Placed Date</td>
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
        <Col xs={12}>
          <AdminTitleBar titleText={"Order #" + orderid} construction={false} />
        </Col>
        {markup}
      </Row>
    </>
  );
}
export default MyOrderDetail;