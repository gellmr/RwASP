import React from 'react';
import { useSelector } from 'react-redux'
import { NavLink } from "react-router";
import VL from "@/Shop/VL";
import { useLocation } from 'react-router';
import CartBtn from "@/Shop/CartBtn";

const AdminLink = () => {
  const location = useLocation();
  const login = useSelector(state => state.login.value);
  const withinAdmin = location.pathname.indexOf("/admin") !== -1;
  const isLoggedIn = login !== "";

  const adminLinks = (
    <>
      <NavLink to="/admin/products" className="mgNavLinkBtn mgAdminNavLinks" >Products</NavLink><VL />
      <NavLink to="/admin/orders" className="mgNavLinkBtn mgAdminNavLinks" >Backlog</NavLink><VL />
      <NavLink to="/admin/useraccounts" className="mgNavLinkBtn mgAdminNavLinks" style={{ textWrapMode:"nowrap" }}>
        <span className="mgAdminNavHideMD">Customer&nbsp;</span>
        Accounts
      </NavLink>
      <span className="d-sm-block d-md-none"><VL /></span>
    </>
  );

  const markup = function () {
    if (isLoggedIn && withinAdmin) {
      return ( // Logged in and currently on the admin pages
        <>{adminLinks}</>
      );
    } else if (isLoggedIn) { // Logged in but not on the admin pages
      return (
        <>
          <NavLink to="/myorders" className="mgNavLinkBtn" style={{ textWrapMode:"nowrap" }}>
            <span className="mgAdminNavHideMD">My&nbsp;</span>
            Orders
          </NavLink>
          <CartBtn isSmall={false} />
          <NavLink to="/admin/orders" className="mgNavLinkBtn mgAdminNavLinks" style={{ textWrapMode: "nowrap" }}>
            Admin
            <span className="mgAdminNavHideMD">&nbsp;Pages</span>
          </NavLink>
        </>
      );
    }
    return ( // Not logged in
      <>
        <NavLink to="/myorders" className="mgNavLinkBtn" style={{ textWrapMode:"nowrap"}} >My Orders</NavLink>
        <CartBtn isSmall={false} />
      </>
    );
  }

  return (
    <>
      {markup()}
    </>
  );
}

export default AdminLink;