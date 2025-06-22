import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setCartQuantity, removeFromCart, updateCartOnServer } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ cartLineID })
{
  const dispatch = useDispatch(); // Redux store dispatch

  const cartLoading = useSelector(state => state.cart.isLoading);
  const cart        = useSelector(state => state.cart.cartLines);
  const cartLine    = cart.find(row => row.cartLineID === cartLineID);
  const ispID       = cartLine.isp.id;

  const title = cartLine.isp.title;
  const slug  = cartLine.isp.description;
  const price = cartLine.isp.price;
  const qtyInCartInt = cartLine.qty;

  const subtot = price * qtyInCartInt;

  const copyProduct = JSON.parse(JSON.stringify(cartLine.isp)); // ensure deep copy

  return (
    <Row>
      <Col xs={12} className="inCartProd">

        <Row className="innerRow">
          <Col xs={8}>
            <div data-product-id={cartLineID} className="inCartItemText">
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
            <span style={{ fontWeight:"500" }}>{qtyInCartInt}</span>
          </Col>

          <Col xs={8} style={{ textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "flex-start" }}>
            <p style={{ marginTop: "0px", marginBottom: "8px" }}>{slug}</p>
          </Col>

          <Col xs={4} className="cartLineSubInfoBottom">
            <div style={{ textAlign: "right" }}>Price: ${subtot}</div>
          </Col>

          <Col xs={12} className="inCartItemRemove">
            <ButtonGroup>
              <Button variant="light btn-sm" style={{ fontSize: "12px", width: "60px" }} onClick={() => { dispatch(removeFromCart({ cartLineID:cartLineID })) }}>Remove</Button>
              <Button variant="light btn-sm" disabled={cartLoading} onClick={() => {
                const newQty = qtyInCartInt - 1;
                dispatch(setCartQuantity({    cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
                dispatch(updateCartOnServer({ cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
              }}><i className="bi bi-dash" style={{ fontSize: "15px" }} ></i></Button>
              <Button variant="light btn-sm" disabled={cartLoading} onClick={() => {
                const newQty = qtyInCartInt + 1;
                dispatch(setCartQuantity({    cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
                dispatch(updateCartOnServer({ cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
              }}><i className="bi bi-plus" style={{ fontSize: "15px" }} ></i></Button>
            </ButtonGroup>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;