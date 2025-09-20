import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ShopButton from "@/Nav/Links/ShopButton";
import AdminConsoleBtn from "@/Nav/Links/AdminConsoleBtn";

import MyOrdersBtn from '@/Nav/Links/MyOrdersBtn';
import AdminPagesBtn from '@/Nav/Links/AdminPagesBtn';
import ProductsBtn from '@/Nav/Links/ProductsBtn';
import BackLogBtn from '@/Nav/Links/BackLogBtn';
import CustAccountsBtn from '@/Nav/Links/CustAccountsBtn';

import CartBtn from "@/Nav/Links/CartBtn";
import SmallCartBtn from "@/Nav/Links/SmallCartBtn";

import VL from "@/Nav/Links/VL";

function NavLoggedOut({ myOrdersCount })
{
  const linkTo = "/";
  const showCart = (linkTo == "/" ? true : false);

  const NormalCartButtonMarkup = showCart && <div className="d-none d-sm-inline-block">
    <CartBtn /><VL />
  </div>;

  const SmallCartButtonMarkup = showCart && <div className="d-inline-block d-sm-none">
    <SmallCartBtn />
  </div>;

  const links = (
    <>
      {NormalCartButtonMarkup}
      <MyOrdersBtn orderCount={myOrdersCount()} /><VL />
    </>
  );

  return (
    <>
      {/* xs screen render cart button here also */}
      {SmallCartButtonMarkup}

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto mg-nav-items">
          <ShopButton withBackArrow={false} /><VL />
          {links}
          <AdminConsoleBtn />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}
export default NavLoggedOut;