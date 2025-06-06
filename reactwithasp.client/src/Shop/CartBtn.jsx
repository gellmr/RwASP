import { useSelector } from 'react-redux'
import { NavLink } from "react-router";

function CartBtn({ isSmall }){
  const cartProducts = useSelector(state => state.cart.value);
  const baseCss = "mgNavLinkBtn mgNavLinkCartBtn";
  const myCss = (isSmall === true) ? baseCss + " d-block d-sm-none lime" : baseCss + " d-none d-sm-block";
  return (
    <>
      <NavLink to="/cart" className={myCss}>Cart: {cartProducts && cartProducts.length} Items</NavLink>
    </>
  );
}
export default CartBtn;