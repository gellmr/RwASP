import { useSelector, useDispatch } from 'react-redux'
import { addToCart, updateCartOnServer } from '@/features/cart/cartSlice.jsx'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({ title, slug, productId, price })
{
  const dispatch = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.

  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    name of local state const
  //    |                             Redux internal state (eg the store)
  //    |                             |              Name of our slice
  //    |                             |              |
  const inStockProducts = useSelector(state => state.inStock.value); // get the value of the state variable in our slice. An array.
  const cartProducts    = useSelector(state => state.cart.value); // array of products
  const product    = inStockProducts.find(p => p.id === productId); // Get the in stock product
  const prodInCart = cartProducts.find(p => p.id === productId);
  const qtyInCartInt = prodInCart === undefined ? 0 : prodInCart.qty;
  const qtyInCartMarkup = prodInCart === undefined ? <span>&nbsp;&nbsp;</span> : prodInCart.qty;

  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">

        <Row>
          <Col xs={12} sm={9}>
            <div className="productDetails">
              <h5>{title}&nbsp;<span className="inStockPrice">${price}</span></h5>
              <span>{slug}</span>
            </div>
          </Col>
          <Col xs={12} sm={3} className="flexContAddToCart">
            <span className="d-none d-sm-block" style={{ textAlign: "right", fontSize: "13px", paddingRight: "7px", marginLeft: "0px" }}>Add to Cart</span>
            <span className="d-block d-sm-none" style={{ textAlign: "right", fontSize: "13px", paddingRight: "7px" }}>Add to Cart</span>
            <ButtonGroup className="addToCartBtnGroup">
              <Button disabled variant="success" className="currentlyAdded" style={{ borderRadius:"4px", fontSize:"14px", fontWeight:500}}>{qtyInCartMarkup}</Button>
              <Button variant="light" style={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} onClick={() => { if (qtyInCartMarkup > 0) { dispatch(addToCart({ id: productId, product: product, qty: -1 })) } }}><i className="bi bi-dash" style={{ fontSize: "13px" }}></i></Button>
              <Button variant="light" onClick={() => {
                dispatch(addToCart({ id: productId, product: product, qty: 1 }));
                dispatch(updateCartOnServer({ itemID:productId, itemQty:qtyInCartInt, adjust:1 }));
              }}><i className="bi bi-plus" style={{ fontSize: "15px" }}></i></Button>
            </ButtonGroup>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;