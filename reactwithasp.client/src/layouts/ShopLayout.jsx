import React from 'react';
import NavBar from "../Shop/NavBar";

const ShopLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div id="shopLayout">
        {children}
      </div>
    </>
  );
}

export default ShopLayout;