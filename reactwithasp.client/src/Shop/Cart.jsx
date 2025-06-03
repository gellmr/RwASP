import { useSelector } from 'react-redux'
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import CartProduct from "@/Shop/CartProduct";
import CartBar from "@/Shop/CartBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products
  return (
    <ShopLayout>
      <h2>Your Cart:</h2>
      <PaginationLinks />
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="cartContents col-12 col-lg-8">
            {cartProducts && cartProducts.map(prod =>
              <CartProduct key={prod.id} title={prod.product.title} slug={prod.product.description} productId={prod.product.id} />
            )}
          </Col>
          <CartBar />
        </Row>
      </div>
      <PaginationLinks />
    </ShopLayout>
  );
}
export default Cart;