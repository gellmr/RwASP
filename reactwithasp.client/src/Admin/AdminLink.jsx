import React from 'react';
import { useSelector } from 'react-redux'
import { NavLink } from "react-router";
import VL from "@/Shop/VL";
import { useLocation } from 'react-router';

const AdminLink = () => {
  const location = useLocation();
  const login = useSelector(state => state.login.value);
  const withinAdmin = location.pathname.indexOf("/admin") !== -1;
  const isLoggedIn = login !== "";

  const adminLinks = (
    <>
      <NavLink to="/admin/products" className="mgNavLinkBtn mgAdminNavLinks" >Products</NavLink><VL />
      <NavLink to="/admin/orders" className="mgNavLinkBtn mgAdminNavLinks" >Orders</NavLink><VL />
      <NavLink to="/admin/useraccounts" className="mgNavLinkBtn mgAdminNavLinks" >User Accounts</NavLink>
    </>
  );

  const adminLink = function () {
    if (isLoggedIn && withinAdmin) {
      return ( // Logged in and currently on the admin pages
        <>
          {adminLinks}
        </>
      );
    } else if (isLoggedIn) { // Logged in but not on the admin pages
      return (
        <>
          <NavLink to="/myorders" className="mgNavLinkBtn" >My Orders</NavLink><VL />
          {adminLinks}
        </>
      );
    }
    return ( // Not logged in
      <>
        <NavLink to="/myorders" className="mgNavLinkBtn" >My Orders</NavLink>
      </>
    );
  }

  return (
    <>
      {adminLink()}
    </>
  );
}

export default AdminLink;