import ShopLayout from "../layouts/ShopLayout";

function App()
{
  const contents =
    <div>
      <h2>Shop Contents</h2>
      <h2>Shop Contents</h2>
      <h2>Shop Contents</h2>
    </div>;

  return (
    <ShopLayout>
      <div id="Shop">
        <h1>Shop</h1>
        <p>This is the shop</p>
        {contents}
      </div>
    </ShopLayout>
  );
}

export default App;