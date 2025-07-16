import { useSelector, useDispatch } from 'react-redux'
import { setCartQuantity, updateCartOnServer } from '@/features/cart/cartSlice.jsx'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import React from 'react';
import "@/App.css";

function InStockProductCanAdd({ ispID, title, slug, price, category, cartLineID, children })
{
  const dispatch = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.

  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    Name of local state const
  //    |                             Redux internal state (eg the store)
  //    |                             |              Name of our slice
  //    |                             |              |
  const inStockProducts = useSelector(state => state.inStock.value);       // Get the value of the state variable in our slice. An array.
  const cartProducts    = useSelector(state => state.cart.cartLines);          // Array of products

  const storeProduct = inStockProducts.find(p => p.id === ispID); // Get the in stock product
  const prodInCart = cartProducts.find(row => row.isp.id === ispID);

  const qtyInCartInt    = (prodInCart === undefined) ? 0 : prodInCart.qty;
  const qtyInCartMarkup = (prodInCart === undefined) ? <span>&nbsp;&nbsp;</span> : prodInCart.qty;

  const copyProduct = (storeProduct == undefined) ? undefined : JSON.parse(JSON.stringify(storeProduct)); // ensure deep copy

  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">

        <Row>
          <Col xs={4} md={3} lg={4} className="mgImgThumb">
            <img src={copyProduct.image} />
          </Col>
          <Col xs={8} md={9} lg={8}>
            <div className="productDetails">
              <h5>{title}&nbsp;<span className="inStockPrice">${price}</span></h5>
              <span>{slug}{children}</span>
            </div>
          </Col>
          <Col xs={12} className="flexContAddToCart">
            <span className="d-none d-sm-block" style={{ textAlign: "right", fontSize: "13px", paddingRight: "7px", marginLeft: "0px" }}>Add to Cart</span>
            <span className="d-block d-sm-none" style={{ textAlign: "right", fontSize: "13px", paddingRight: "7px" }}>Add to Cart</span>
            <ButtonGroup className="addToCartBtnGroup">
              <Button disabled variant="success" className="currentlyAdded" style={{ borderRadius:"4px", fontSize:"14px", fontWeight:500}}>{qtyInCartMarkup}</Button>
              <Button variant="light" style={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} onClick={() => {
                if (qtyInCartMarkup > 0) {
                  const newQty = qtyInCartInt - 1;
                  dispatch(setCartQuantity({    cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
                  dispatch(updateCartOnServer({ cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
                }
              }}><i className="bi bi-dash" style={{ fontSize: "13px" }}></i></Button>
              <Button variant="light" onClick={() => {
                const newQty = qtyInCartInt + 1;
                dispatch(setCartQuantity({    cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
                dispatch(updateCartOnServer({ cartLineID:cartLineID, qty:newQty, isp:copyProduct }));
              }}><i className="bi bi-plus" style={{ fontSize: "15px" }}></i></Button>
            </ButtonGroup>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;