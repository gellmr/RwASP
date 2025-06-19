import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setCartQuantity, removeFromCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ productId })
{
  const dispatch = useDispatch(); // Redux store dispatch

  const cartLoading = useSelector(state => state.cart.isLoading);
  const cart        = useSelector(state => state.cart.value);
  const cartProduct = cart.find(p => p.ispID === productId); // isp is the InStockProduct

  const title = cartProduct.isp.title;
  const slug  = cartProduct.isp.description;
  const price = cartProduct.isp.price;
  const qty   = cartProduct.qty;

  const subtot = price * qty;

  const copyProduct = JSON.parse(JSON.stringify(cartProduct.isp)); // ensure deep copy

  return (
    <Row>
      <Col xs={12} className="inCartProd">

        <Row className="innerRow">
          <Col xs={8}>
            <div data-product-id={productId} className="inCartItemText">
              <h6>
                {title} ${price} 
              </h6>
            </div>
          </Col>

          <Col xs={4} style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", fontSize:"12px" }}>
            <span className="d-block d-sm-none cartQtyXXs" >Qty:</span>
            <span className="cartQtyXs d-block d-sm-none" >Quantity:</span>
            <span className="d-none d-sm-block" >Quantity:</span>
            &nbsp;
            <span style={{ fontWeight:"500" }}>{qty}</span>
          </Col>

          <Col xs={8} style={{ textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "flex-start" }}>
            <p style={{ marginTop: "0px", marginBottom: "8px" }}>{slug}</p>
          </Col>

          <Col xs={4} className="cartLineSubInfoBottom">
            <div style={{ textAlign: "right" }}>Price: ${subtot}</div>
          </Col>

          <Col xs={12} className="inCartItemRemove">
            <ButtonGroup>
              <Button variant="light btn-sm" style={{ fontSize: "12px", width: "60px" }} onClick={() => { dispatch(removeFromCart({ ispID:productId })) }}>Remove</Button>
              <Button variant="light btn-sm" disabled={cartLoading} onClick={() => {
                const newQty = qtyInCartInt - 1;
                dispatch(setCartQuantity({    ispID:productId, qty:newQty, isp:copyProduct }));
                dispatch(updateCartOnServer({ ispID:productId, qty:newQty }));
              }}><i className="bi bi-dash" style={{ fontSize: "15px" }} ></i></Button>
              <Button variant="light btn-sm" disabled={cartLoading} onClick={() => {
                const newQty = qtyInCartInt + 1;
                dispatch(setCartQuantity({    ispID:productId, qty:newQty, isp:copyProduct }));
                dispatch(updateCartOnServer({ ispID:productId, qty:newQty }));
              }}><i className="bi bi-plus" style={{ fontSize: "15px" }} ></i></Button>
            </ButtonGroup>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;