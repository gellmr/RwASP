import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InlineLinks from "@/Nav/InlineLinks";
import StackedLinks from "@/Nav/StackedLinks";

import ShopButton from "@/Nav/Links/ShopButton";
import ProductsBtn from '@/Nav/Links/ProductsBtn';
import BackLogBtn from '@/Nav/Links/BackLogBtn';
import CustAccountsBtn from '@/Nav/Links/CustAccountsBtn';
import AdminConsoleBtn from "@/Nav/Links/AdminConsoleBtn";

function NavAdminLoggedIn()
{
  const linkTo = "/admin/orders";
  const showCart = (linkTo == "/" ? true : false);

  const inlineLinks = (
    <InlineLinks
      linkA={<ShopButton withBackArrow={true} />}
      linkB={<BackLogBtn />}
      linkC={<CustAccountsBtn />}
      linkD={<ProductsBtn />}
    />
  );

  const stackedLinks = (
    <StackedLinks
      linkA={<ShopButton withBackArrow={true} />}
      linkB={<BackLogBtn />}
      linkC={<CustAccountsBtn />}
      linkD={<ProductsBtn />}
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
export default NavAdminLoggedIn;