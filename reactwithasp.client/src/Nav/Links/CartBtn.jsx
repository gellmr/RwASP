import ResponsiveLink from '@/Nav/Links/ResponsiveLink';
import { useSelector } from 'react-redux'

function CartBtn()
{
  const cartProducts = useSelector(state => state.cart.cartLines);
  const cartTotalItems = (cartProducts && cartProducts.length > 0) ? cartProducts.reduce((total, row) => total + row.qty, 0) : 0;

  const markup = () => (
    <div style={{ color: "" }}>
      <i className="bi bi-cart3" style={{ marginRight: 4, display: "inline-block" }}></i>
      Cart:&nbsp;{cartTotalItems}
    </div>
  );

  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={markup}
      toRoute="/cart"
    />
  );
}
export default CartBtn;