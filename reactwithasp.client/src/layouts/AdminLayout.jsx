import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <>
      <div id="adminLayout">
        {children}
      </div>
    </>
  );
}

export default AdminLayout;