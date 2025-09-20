import { useSelector } from 'react-redux'
import ResponsiveLink from '@/Nav/Links/ResponsiveLink';
import HideInlineBlockXXs from "@/Nav/Links/HideInlineBlockXXs";

function SmallCartBtn() {
  const cartProducts = useSelector(state => state.cart.cartLines);
  const cartTotalItems = (cartProducts && cartProducts.length > 0) ? cartProducts.reduce((total, row) => total + row.qty, 0) : 0;

  const s = cartTotalItems == 1 ? "" : "s";

  const markup = () => (
    <div style={{ color: ""}}>
      <i className="bi bi-cart3" style={{ marginRight: 4, display: "inline-block"}}></i>
      Cart:&nbsp;{cartTotalItems}<HideInlineBlockXXs>&nbsp;Item{s}</HideInlineBlockXXs>
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
export default SmallCartBtn;