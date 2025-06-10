import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ productId })
{
  const dispatch = useDispatch(); // Redux store dispatch
  const cart = useSelector(state => state.cart.value);

  const cartProduct = cart.find(p => p.id === productId);
  const title = cartProduct.title;
  const slug = cartProduct.description;
  const qty = cartProduct.qty;

  console.log("Render t:" + title + " s:" + slug + " i:" + productId + " q:" + qty);

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

          <Col xs={12} sm={6} style={{ textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "flex-start" }}>
            <p style={{ marginTop: "0px", marginBottom: "8px" }}>{slug}</p>
          </Col>

          <Col xs={12} sm={6} className="inCartItemRemove">
            <ButtonGroup>
              <Button variant="light btn-sm" style={{ fontSize: "12px", width:"60px" }} onClick={() => { dispatch(removeFromCart({ id: productId })) }}>Remove</Button>
              <Button variant="light btn-sm"><i className="bi bi-dash" style={{ fontSize: "15px" }} onClick={() => { dispatch(addToCart({ id: productId, product: cartProduct, qty: -1 })) }}></i></Button>
              <Button variant="light btn-sm"><i className="bi bi-plus" style={{ fontSize: "15px" }} onClick={() => { dispatch(addToCart({ id: productId, product: cartProduct, qty:  1 })) }}></i></Button>
            </ButtonGroup>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;