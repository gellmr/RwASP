import { useEffect, useState } from 'react';
//import { useCartProducts, useCartDispatch } from '@/Shop/CartContext';
import { useInStockProducts, useInStockDispatch } from '@/Shop/InStockContext';
import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  const inStockProducts = useInStockProducts();
  const inStockDispatch = useInStockDispatch();

  //const cartProducts = useCartProducts();
  //const [inStockProducts, setInStockProducts] = useState([]); // OLD WAY. state variable

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch('api/products');
    const data = await response.json();
    //setInStockProducts(data);
    inStockDispatch({ type: 'addRange', data:data }); // UP TO HERE.    Google "react after fetch call dispatch"
  }

  return (
    <ShopLayout>
      <PaginationLinks />
      {
        inStockProducts && inStockProducts.map(prod => (<InStockProductCanAdd key={prod.id} title={prod.title} slug={prod.description} productId={prod.id} />))
      }
      <PaginationLinks />
    </ShopLayout>
  );
}

export default ShopApp;