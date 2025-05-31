import { useProducts, useProductsDispatch } from '@/Shop/ProductsContext';
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  const products = useProducts();
  return (
    <ShopLayout>
      <PaginationLinks />
      {products.map(product => (
        <InStockProductCanAdd key={product.id} title={product.title} slug={product.slug} />
      ))}
      <PaginationLinks />
    </ShopLayout>
  );
}

export default ShopApp;