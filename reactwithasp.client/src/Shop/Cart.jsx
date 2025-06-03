import { useSelector } from 'react-redux'
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import CartProduct from "@/Shop/CartProduct";
function Cart() {
  const cartProducts = useSelector(state => state.cart.value); // array of products
  return (
    <ShopLayout>
      <h2>Your Cart:</h2>
      <PaginationLinks />
      <div className="cartContents">
        {cartProducts && cartProducts.map(prod =>
          <CartProduct key={prod.id} title={prod.product.title} slug={prod.product.description} productId={prod.product.id} />
        )}
      </div>
      <PaginationLinks />
    </ShopLayout>
  );
}
export default Cart;