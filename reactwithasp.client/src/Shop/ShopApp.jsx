import ShopLayout from "../layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  return (
    <ShopLayout>
      <PaginationLinks />
      <InStockProductCanAdd>Product A</InStockProductCanAdd>
      <InStockProductCanAdd>Product B</InStockProductCanAdd>
      <InStockProductCanAdd>Product C</InStockProductCanAdd>
      <InStockProductCanAdd>Product D</InStockProductCanAdd>
      <InStockProductCanAdd>Product E</InStockProductCanAdd>
      <PaginationLinks />
    </ShopLayout>
  );
}

export default ShopApp;