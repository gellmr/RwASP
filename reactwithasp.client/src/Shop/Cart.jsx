import { useSelector } from 'react-redux'
import PaginationLinks from "@/Shop/PaginationLinks";
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products
  return (
    <>
      <h2>Your Cart:</h2>
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="cartContents col-12 col-lg-8">
            {!cartProducts || cartProducts.length === 0 && <div className="fetchErr" style={{ textAlign: "center" }}>( Empty )</div>}
            {cartProducts && cartProducts.map(prod =>
              <CartProduct key={prod.id} title={prod.product.title} slug={prod.product.description} productId={prod.product.id} />
            )}
          </Col>
          <CartBar />
        </Row>
      </div>
    </>
  );
}
export default Cart;