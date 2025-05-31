import { useEffect, useState } from 'react';
import { useProducts, useProductsDispatch } from '@/Shop/ProductsContext';
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  const products = useProducts(); // Todo - Rename as cartProducts
  const [inStockProducts, setInStockProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch('api/products');
    const data = await response.json();
    setInStockProducts(data);
  }

  return (
    <ShopLayout>
      <PaginationLinks />
      {inStockProducts.map(prod => (
        <InStockProductCanAdd key={prod.id} title={prod.title} slug={prod.description} productId={prod.id} />
      ))}
      <PaginationLinks />
    </ShopLayout>
  );
}

export default ShopApp;