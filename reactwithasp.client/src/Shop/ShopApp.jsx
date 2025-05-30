import ShopLayout from "../layouts/ShopLayout";

function ShopApp()
{
  const contents =
    <div>
      <h2>Shop Contents</h2>
      <h2>Shop Contents</h2>
      <h2>Shop Contents</h2>
    </div>;

  return (
    <ShopLayout>
      <div id="shopApp">
        <h1>ShopApp</h1>
        <p>This is the shop</p>
        {contents}
      </div>
    </ShopLayout>
  );
}

export default ShopApp;