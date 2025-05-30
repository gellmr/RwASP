import React from 'react';
import NavBar from "../main/NavBar";

const AdminLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="index">Back to Shop</a></NavBar>
      <div id="adminLayout">
        {children}
      </div>
    </>
  );
}

export default AdminLayout;