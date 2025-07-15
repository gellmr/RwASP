import React from 'react';
import { useSelector } from 'react-redux'
import { NavLink } from "react-router";
import VL from "@/Shop/VL";

const AdminLink = () => {
  const login = useSelector(state => state.login.value);

  const adminLink = function () {
    if (login === "") {
      return (
        <>
          <NavLink to="/myorders" className="mgNavLinkBtn" >My Orders</NavLink>
        </>
      );
    }
    return (
      <>
        <NavLink to="/admin/products" className="mgNavLinkBtn" >Products</NavLink><VL />
        <NavLink to="/admin/orders" className="mgNavLinkBtn" >Orders</NavLink><VL />
        <NavLink to="/admin/useraccounts" className="mgNavLinkBtn" >User Accounts</NavLink>
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