import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInStock } from '@/features/inStock/inStockSlice.jsx'
import { useParams } from 'react-router';

import ShopLayout from "@/layouts/ShopLayout";
import ProductSearchBox from "@/Shop/ProductSearchBox";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";

function Shop()
{
  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    name of local state const
  //    |                             Redux internal state (eg the store)
  //    |                             |              Name of our slice
  //    |                             |              |
  const inStockProducts = useSelector(state => state.inStock.value); // get the value of the state variable in our slice. An array.
  const dispatch = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.
  const { page } = useParams(); // The page of products we are on, eg "2". Obtained from react route...  /index/2

  const prodPerPage = 4;                                                // Products per page
  const pageIdx = (page === undefined) ? 0 : Number.parseInt(page) - 1; // eg ( page 0                   1           page 2 )
  const startIdx = prodPerPage * pageIdx;                               // eg ( 4 * 0 == 0)   ( 4 * 1 == 4 )   ( 4 * 2 == 8 ) ...
  const endIdx = startIdx + prodPerPage;                                // eg            4 ...           8 ...            12  ...
  const inStockProdThisPage = inStockProducts.slice(startIdx, endIdx);

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
      <ProductSearchBox />
      <PaginationLinks numPages={4} currPage={page} />
      {!inStockProdThisPage && <span>"Please wait for Vite to load and then refresh browser. This should never happen in production."</span>}
      {inStockProdThisPage && inStockProdThisPage.map(prod =>
        <InStockProductCanAdd key={prod.id} title={prod.title} slug={prod.description} productId={prod.id} />
      )}
      <PaginationLinks numPages={4} currPage={page} />
    </ShopLayout>
  );
}
export default Shop;