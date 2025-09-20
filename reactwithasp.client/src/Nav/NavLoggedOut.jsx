import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InlineLinks from "@/Nav/InlineLinks";
import StackedLinks from "@/Nav/StackedLinks";

import ShopButton from "@/Nav/Links/ShopButton";
import CartBtn from "@/Nav/Links/CartBtn";
import SmallCartBtn from "@/Nav/Links/SmallCartBtn";
import MyOrdersBtn from '@/Nav/Links/MyOrdersBtn';
import AdminConsoleBtn from "@/Nav/Links/AdminConsoleBtn";

function NavLoggedOut({ myOrdersCount })
{
  const linkTo = "/";
  const showCart = (linkTo == "/" ? true : false);

  const inlineLinks = (
    <InlineLinks
      linkA={<ShopButton withBackArrow={false} />}
      linkB={<SmallCartBtn />}
      linkC={<MyOrdersBtn orderCount={myOrdersCount()} />}
      linkD={null}
    />
  );

  const stackedLinks = (
    <StackedLinks
      linkA={<ShopButton withBackArrow={false} />}
      linkB={showCart && <CartBtn />}
      linkC={<MyOrdersBtn orderCount={myOrdersCount()} />}
      linkD={null}
    />
  );

  return (
    <>
      {inlineLinks}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto mg-nav-items">
          {stackedLinks}
          <AdminConsoleBtn />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}
export default NavLoggedOut;