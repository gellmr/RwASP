import { useSelector } from 'react-redux'
import { NavLink } from "react-router";

function CartBtn({ isSmall }){
  const cartProducts = useSelector(state => state.cart.cartLines);
  const cartTotalItems = (cartProducts && cartProducts.length > 0) ? cartProducts.reduce((total, row) => total + row.qty, 0) : 0;
  const baseCss = "mgNavLinkBtn mgNavLinkCartBtn";
  const myCss = (isSmall === true) ? baseCss + " d-block d-sm-none lime" : baseCss + " d-none d-sm-block";
  return (
    <>
      <NavLink to="/cart" className={myCss} style={{textWrapMode: "nowrap"}} >
        <i className="bi bi-cart3" style={{ marginRight: 4, display: "inline-block" }}></i>
        Cart:&nbsp;{cartTotalItems}
        <span className="d-none d-sm-none d-md-inline-block">
          &nbsp;Items
        </span>
      </NavLink>
    </>
  );
}
export default CartBtn;