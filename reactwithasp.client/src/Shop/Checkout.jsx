import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CartBar from "@/Shop/CartBar";
function Checkout() {
  return (
    <>
      <h2>Checkout</h2>
      <div className="col-12">
        <Row>
          <CartBar />
          <Col>
            (Products)
          </Col>
          <CartBar />
        </Row>
      </div>
    </>
  );
}
export default Checkout;