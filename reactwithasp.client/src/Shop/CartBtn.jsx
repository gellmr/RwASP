import { useSelector } from 'react-redux'
import { NavLink } from "react-router";

function CartBtn({ isSmall }){
  const cartProducts = useSelector(state => state.cart.value);
  const cartTotalItems = cartProducts.reduce((total, item) => total + item.qty, 0);
  const baseCss = "mgNavLinkBtn mgNavLinkCartBtn";
  const myCss = (isSmall === true) ? baseCss + " d-block d-sm-none lime" : baseCss + " d-none d-sm-block";
  return (
    <>
      <NavLink to="/cart" className={myCss}>Cart: {cartProducts && cartTotalItems} Items</NavLink>
    </>
  );
}
export default CartBtn;