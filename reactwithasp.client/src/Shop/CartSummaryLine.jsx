import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartSummaryLine({ totalQuantity, totalPrice }) {
  return (
    <Row>
      <Col xs={12} className="inCartProd">

        <Row className="innerRow">
          <Col xs={7}>
            <div className="inCartItemText">
              <h6>Total:</h6>
            </div>
          </Col>

          <Col xs={5} style={{ textAlign: "right", display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "14px", paddingTop: "1px", fontWeight: "500" }}>{totalQuantity}</span>
            &nbsp;
            <span style={{ fontWeight: "400", fontSize:"14px" }}>Items</span>
          </Col>

          <Col xs={7} style={{ textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "flex-start" }}></Col>

          <Col xs={5}><div style={{ textAlign: "right" }}>$ {totalPrice}</div></Col>
        </Row>

      </Col>
    </Row>
  );
}
export default CartSummaryLine;