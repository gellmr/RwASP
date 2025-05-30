import React from 'react';
import NavBar from "@/main/NavBar";

const ShopLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="indexAdmin">Admin Page</a></NavBar>
      <div id="shopLayout" style={{ border: '3px solid lime'}} >
        {children}
      </div>
    </>
  );
}

export default ShopLayout;