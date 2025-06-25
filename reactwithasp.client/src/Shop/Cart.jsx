import { useSelector, useDispatch } from 'react-redux'
import { clearCart, clearCartOnServer } from '@/features/cart/cartSlice.jsx'
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import CartSummaryLine from "@/Shop/CartSummaryLine";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProceedCheckoutBtn from "@/Shop/ProceedCheckoutBtn";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
function Cart()
{
  const dispatch = useDispatch();
  const cartProducts = useSelector(state => state.cart.cartLines); // Array of products

  const gotItems = cartProducts.length > 0;
  const showTopCheckoutBtn = cartProducts.length > 5;

  const totalQty   = cartProducts.reduce((sum, row) => sum + row.qty, 0);
  const totalPrice = cartProducts.reduce((sum, row) => sum + (row.isp.price * row.qty), 0);

  const cartLen = totalQty > 0 ? "Your Cart:" : "Your Cart is Empty";

  return (
    <>
      <h2 style={{ marginTop: "5px" }}>{cartLen}</h2>
      {showTopCheckoutBtn && <div className="proceedCheckoutBar">
        <ButtonGroup>
          <Button variant="light" style={{ fontSize: 13, color: "#777777" }} onClick={() => {
            dispatch(clearCart());
            dispatch(clearCartOnServer());
          }}><i className="bi bi-trash3"></i>&nbsp;Clear Cart</Button>
          <ProceedCheckoutBtn />
        </ButtonGroup>
      </div>}
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="cartContents col-12 col-lg-8">
            {!cartProducts || cartProducts.length === 0 && <div className="fetchErr" style={{ textAlign: "center" }}>( Empty )</div>}
            {cartProducts && cartProducts.map(row =>
              <CartProduct key={row.cartLineID} cartLineID={row.cartLineID} />
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