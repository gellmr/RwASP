import ResponsiveLink from '@/Nav/Links/ResponsiveLink';
import { useSelector } from 'react-redux'
import HideInlineBlockXXs from "@/Nav/Links/HideInlineBlockXXs";

function CartBtn()
{
  const cartProducts = useSelector(state => state.cart.cartLines);
  const cartTotalItems = (cartProducts && cartProducts.length > 0) ? cartProducts.reduce((total, row) => total + row.qty, 0) : 0;

  const s = (cartTotalItems === 1) ? "" : "s";

  const text = <>
    Cart:&nbsp;{cartTotalItems}<HideInlineBlockXXs>&nbsp;Item{s}</HideInlineBlockXXs>
  </>;
  
  const markup = () => (
    <div style={{ color: "" }}>
      <i className="bi bi-cart3" style={{ marginRight: 4, display: "inline-block" }}></i>
      {text}
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