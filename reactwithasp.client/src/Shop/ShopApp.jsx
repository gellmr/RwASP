import ShopLayout from "../layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  return (
    <ShopLayout>
      <PaginationLinks />
      <InStockProductCanAdd title="Soccer Ball $35.00" slug="FIFA approved size and weight." />
      <InStockProductCanAdd title="Corner Flags $25.00" slug="Give some flourish to your playing field with these coloured corner flags." />
      <InStockProductCanAdd title="Referee Whisle $12.00" slug="For serious games, call it with this chrome Referee Whistle." />
      <InStockProductCanAdd title="Red and Yellow Cards $10.00" slug="Official size and colour, waterproof high visibility retroflective coating." />
      <PaginationLinks />
    </ShopLayout>
  );
}

export default ShopApp;