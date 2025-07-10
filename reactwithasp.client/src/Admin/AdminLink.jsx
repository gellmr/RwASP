import React from 'react';
import { useSelector } from 'react-redux'

import { NavLink } from "react-router";

const AdminLink = () => {
  const login = useSelector(state => state.login.value);

  const adminLink = function () {
    const path     = (login === "") ? "/admin" : "/admin/orders";
    const linkText = (login === "") ?  "Admin"  : "Orders";
    return (<NavLink to={path} className="mgNavLinkBtn" >{linkText}</NavLink>);
  }

  return (
    <>
      {adminLink()}
    </>
  );
}

export default AdminLink;