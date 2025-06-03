import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ title, slug, productId })
{
  const cartProducts = useSelector(state => state.cart.value); // array of products
  const dispatch = useDispatch(); // Redux store dispatch

  return (
    <Row>
      <Col xs={12} className="inCartProd">

        <Row className="innerRow">
          <Col xs={12}>
            <div data-product-id={productId} className="inCartItemText">
              <h5>{title}</h5>
              <p>{slug}</p>
            </div>
          </Col>

          <Col xs={12} className="inCartItemRemove">
            <Button variant="success" onClick={() => {
              const cartItem = cartProducts.find(p => p.id === productId);
              dispatch(removeFromCart({ id: productId }));
            }}>Remove</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;