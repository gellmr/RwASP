import { useSelector } from 'react-redux'
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProceedCheckoutBtn from "@/Shop/ProceedCheckoutBtn";
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products
  const gotItems = cartProducts.length > 0;
  const showTopCheckoutBtn = cartProducts.length > 5;
  return (
    <>
      <h2 style={{ marginTop:"5px" }}>Your Cart:</h2>
      {showTopCheckoutBtn && <div style={{ marginTop: "15px", marginBottom:"5px" }}><ProceedCheckoutBtn /></div>}
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="cartContents col-12 col-lg-8">
            {!cartProducts || cartProducts.length === 0 && <div className="fetchErr" style={{ textAlign: "center" }}>( Empty )</div>}
            {cartProducts && cartProducts.map(prod => // passing product to the CartProduct (which doesnt use selector) causes bug, since Cart doesn't always get updated.
              <CartProduct key={prod.id} title={prod.product.title} slug={prod.product.description} productId={prod.product.id} qty={prod.qty} product={prod.product} />
            )}
          </Col>
          <CartBar />
        </Row>
      </div>
      {gotItems && <div style={{ marginTop: "5px" }}><ProceedCheckoutBtn /></div>}
    </>
  );
}
export default Cart;