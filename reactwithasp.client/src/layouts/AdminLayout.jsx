import React from 'react';
import NavBar from "@/main/NavBar";

const AdminLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="index">Back to Shop</a></NavBar>
      <div id="adminLayout" style={{ border: '3px solid orange' }} >
        {children}
      </div>
    </>
  );
}

export default AdminLayout;