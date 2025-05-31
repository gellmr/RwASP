import { useEffect, useState } from 'react';
import { useCartProducts, useCartDispatch } from '@/Shop/CartContext';
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  const cartProducts = useCartProducts();
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