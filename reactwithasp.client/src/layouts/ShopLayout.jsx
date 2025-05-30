import React from 'react';
import NavBar from "../main/NavBar";

const ShopLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="indexAdmin">Admin Page</a></NavBar>
      <div id="shopLayout">
        {children}
      </div>
    </>
  );
}

export default ShopLayout;