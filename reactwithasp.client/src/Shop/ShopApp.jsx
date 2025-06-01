import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { setInStock } from '@/features/inStock/inStockSlice.jsx'

import ShopLayout from "@/layouts/ShopLayout";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function ShopApp()
{
  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    name of local state const
  //    |                             Redux internal state (eg the store)
  //    |                             |              Name of our slice
  //    |                             |              |
  const inStockProducts = useSelector(state => state.inStock.value); // get the value of the state variable in our slice. An array.
  const dispatch = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch('api/products'); // get list of inStock products from ASP.
    const data = await response.json();           // read json objects from stream.
    dispatch(setInStock(data));                   // dispatch 'setInStock' action to the reducer of our inStockSlice. Pass the action payload.
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