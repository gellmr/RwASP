import { useDispatch } from 'react-redux'
import { removeFromCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ title, slug, productId, qty })
{
  const dispatch = useDispatch(); // Redux store dispatch

  return (
    <Row>
      <Col xs={12} className="inCartProd">

        <Row className="innerRow">
          <Col xs={9}>
            <div data-product-id={productId} className="inCartItemText">
              <h6>{title}</h6>
            </div>
          </Col>

          <Col xs={3} style={{ textAlign: "right", display: "flex", justifyContent: "flex-end" }}>
            <span className="d-block d-sm-none cartQtyXXs" style={{ fontSize: "13px", paddingTop: "2px" }}>Qty:</span>
            <span className="cartQtyXs d-block d-sm-none " style={{ fontSize: "13px", paddingTop: "2px" }}>Quantity:</span>
            <span className="d-none d-sm-block" style={{ fontSize: "14px", paddingTop:"1px" }}>Quantity:</span>
            &nbsp;
            <span style={{ fontWeight:"500" }}>{qty}</span>
          </Col>

          <Col xs={9} style={{ textAlign:"left", fontSize:"13px", paddingRight:"55px", display: "flex", justifyContent: "flex-start" }}>
            <p>{slug}</p>
          </Col>

          <Col xs={3} className="inCartItemRemove">
            <Button variant="success" onClick={() => { dispatch(removeFromCart({ id: productId })) }}>Remove</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;