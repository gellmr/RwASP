import { useSelector } from 'react-redux'
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProceedCheckoutBtn from "@/Shop/ProceedCheckoutBtn";
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products
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
            {cartProducts && cartProducts.map(prod =>
              <CartProduct key={prod.id} title={prod.product.title} slug={prod.product.description} productId={prod.product.id} qty={prod.qty} />
            )}
          </Col>
          <CartBar />
        </Row>
      </div>
      <div style={{ marginTop: "5px" }}><ProceedCheckoutBtn /></div>
    </>
  );
}
export default Cart;