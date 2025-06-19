import { useSelector } from 'react-redux'
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import CartSummaryLine from "@/Shop/CartSummaryLine";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProceedCheckoutBtn from "@/Shop/ProceedCheckoutBtn";
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products

  const gotItems = cartProducts.length > 0;
  const showTopCheckoutBtn = cartProducts.length > 5;

  const totalQty   = cartProducts.reduce((sum, row) => sum + row.qty, 0);
  const totalPrice = cartProducts.reduce((sum, row) => sum + (row.isp.price * row.qty), 0);

  return (
    <>
      <h2 style={{ marginTop:"5px" }}>Your Cart:</h2>
      {showTopCheckoutBtn && <div style={{ marginTop: "15px", marginBottom:"5px" }}><ProceedCheckoutBtn /></div>}
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="cartContents col-12 col-lg-8">
            {!cartProducts || cartProducts.length === 0 && <div className="fetchErr" style={{ textAlign: "center" }}>( Empty )</div>}
            {cartProducts && cartProducts.map(row =>
              <CartProduct key={row.ispID} productId={row.ispID} />
            )}
            <CartSummaryLine totalQuantity={totalQty} totalPrice={totalPrice} />
          </Col>
          <CartBar />
        </Row>
      </div>
      {gotItems && <div style={{ marginTop: "5px" }}><ProceedCheckoutBtn /></div>}
    </>
  );
}
export default Cart;