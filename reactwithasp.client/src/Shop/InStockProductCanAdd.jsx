import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '@/features/cart/cartSlice.jsx'

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({ title, slug, productId })
{
  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    name of local state const
  //    |                             Redux internal state (eg the store)
  //    |                             |              Name of our slice
  //    |                             |              |
  const inStockProducts = useSelector(state => state.inStock.value); // get the value of the state variable in our slice. An array.
  const cartProducts    = useSelector(state => state.cart.value);    // get the value of the state variable in our slice. An array.
  const dispatch = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.

  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">

        <Row>
          <Col xs={12} sm={9}>
            <div className="productDetails">
              <h5>{title}</h5>
              <span>{slug}&nbsp;productId:{productId}</span>
            </div>
          </Col>
          <Col xs={12} sm={3} className="flexContAddToCart">
            <Button variant="success" onClick={() => {
              const product = inStockProducts.find(p => p.id === productId); // Get the in stock product
              dispatch(addToCart({ id:productId, product:product} ));        // Add the item to Cart
            }}>Add to Cart</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;