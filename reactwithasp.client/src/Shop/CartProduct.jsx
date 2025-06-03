//import { useDispatch } from 'react-redux'
//import { removeFromCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function CartProduct({ title, slug, productId })
{
  //const dispatch = useDispatch(); // Redux store dispatch
  return (
    <Row className="inCartItemRow">
      <Col xs={12} className="">

        <Row className="innerRow">
          <Col xs={12} sm={9}>
            <div data-product-id={productId} className="inCartItemText">
              <h5>{title}</h5>
              <p>{slug}</p>
            </div>
          </Col>

          <Col xs={12} sm={3} className="inCartItemRemove">
            <Button variant="success" onClick={() => {} }>Remove</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default CartProduct;