import React from 'react';

const NavBar = ({ children }) => {
  return (
    <>
      <div id="navBar">
        {children}
      </div>
    </>
  );
}

export default NavBar;