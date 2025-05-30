import React from 'react';
import NavBar from "../main/NavBar";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const ShopLayout = ({ children }) => {
  return (
    <>
      <NavBar><a href="indexAdmin">Admin Page</a></NavBar>
      <div id="shopLayout" className="container-fluid" style={{ border: '3px solid lime'}} >
        {children}
      </div>
    </>
  );
}

export default ShopLayout;