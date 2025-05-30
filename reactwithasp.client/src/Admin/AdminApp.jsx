import AdminLayout from "../layouts/AdminLayout";

function AdminApp() {
  const contents =
    <div>
      <h2>Admin Page</h2>
      <h2>Admin Page</h2>
      <h2>Admin Page</h2>
    </div>;

  return (
    <AdminLayout>
      <div id="adminPage">
        <h1>AdminApp</h1>
        <p>This is the Admin Page</p>
        {contents}
      </div>
    </AdminLayout>
  );
}

export default AdminApp;