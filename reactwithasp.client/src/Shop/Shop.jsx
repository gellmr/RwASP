import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInStock, setNoStock } from '@/features/inStock/inStockSlice.jsx'
import { useParams } from 'react-router';

import axios from 'axios';
import axiosRetry from 'axios-retry';

import ProductSearchBox from "@/Shop/ProductSearchBox";
import PaginationLinks from "@/Shop/PaginationLinks";
import InStockProductCanAdd from "@/Shop/InStockProductCanAdd";
import ProceedCartBtn from "@/Shop/ProceedCartBtn";

function Shop()
{
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios instance.
  axiosRetry(axios, { retries: 7, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
      console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  // We can get a state variable from our slice, with useSelector, that gets it from the Redux store.
  //    Name of local state const
  //    |                                Redux internal state (eg the store)
  //    |                                |              Name of our slice
  //    |                                |              |
  const inStockProducts    = useSelector(state => state.inStock.value); // Get the value of the state variable in our slice. An array.
  const cartProducts       = useSelector(state => state.cart.cartLines);    // Array of products
  const search             = useSelector(state => state.search.value);
  const dispatch           = useDispatch(); // We can dispatch actions to the Redux store, by targeting the reducer actions in our slice, by name.
  const { page, category } = useParams();   // The page of products we are on, eg "2". Obtained from react route...  /index/2

  // Apply pagination to search results
  const pageInt = page !== undefined ? Number.parseInt(page) : 1;
  const prodPerPage = 4;                                                    // Products per page
  const maxWholePageNum = Math.floor(inStockProducts.length / prodPerPage); // floor ( 7 / 4 ) == 1
  const extraPage = (inStockProducts.length % prodPerPage === 0) ? 0 : 1;
  const numPages = maxWholePageNum + extraPage;                         // Add an extra page if we need to. Eg 7 products will require (4 + 3 == 2) pages
  const pageIntP = (pageInt > maxWholePageNum) ? numPages : pageInt;    // Navigate to the max number page. Eg 1 ...Maybe move call to inStock reducer action.

  const pageIdx = (page === undefined) ? 0 : pageIntP - 1;              // eg (     page 0          page 1           page 2 )
  const startIdx = prodPerPage * pageIdx;                               // eg ( 4 * 0 == 0)   ( 4 * 1 == 4 )   ( 4 * 2 == 8 ) ...
  const endIdx = startIdx + prodPerPage;                                // eg            4 ...           8 ...            12  ...

  // Add the cartLineID to each product, if available.
  const inStockProdThisPage = inStockProducts.slice(startIdx, endIdx).map(isp => {
    const cartProd = cartProducts.find(c => c.isp.id == isp.id);
    const cartLineID = cartProd === undefined ? null : cartProd.cartLineID;
    return {
      id:          isp.id,
      title:       isp.title,
      description: isp.description,
      price:       isp.price,
      category:    isp.category,
      cartLineID: cartLineID // Will be null, if the product is not in our cart.
    };
  });

  // The value of pageIntP should be 1 when we first visit the site, and have an initial page of products.
  // It may be 0 for a while during re-renders as the products are still being fetched.

  const gotItems = cartProducts.length > 0; // true if there are items in cart
  
  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  async function fetchProducts()
  {
    // Get list of products from server. Get all products or search by category.
    const cat = category !== undefined ? "/category/" + category : "";
    const query = (search !== undefined && search !== "") ? "?search=" + search : "";
    const url = window.location.origin + "/api/products" + cat + query;

    console.log("Axios retry..." + url);
    axios.get(url).then((response) => {
      console.log('Data fetched:', response.data); // response.data is already JSON
      dispatch(setInStock(response.data)); // Dispatch 'setInStock' action to the reducer of our inStockSlice. Pass the action payload.
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      dispatch(setNoStock()); // Failed to load products
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const markup =
    (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)     ? <div className="fetchErr">Error: {error.message}</div> : (
    (!inStockProdThisPage || inStockProdThisPage.length === 0) ? <div className="fetchErr">( Search returned no results )</div> : (
    inStockProdThisPage && inStockProdThisPage.map(prod =>
      <InStockProductCanAdd key={prod.id}
        ispID={prod.id}
        title={prod.title}
        slug={prod.description}
        price={prod.price}
        category={prod.category}
        cartLineID={prod.cartLineID}>
        {/*<span style={{ backgroundColor: "red", color: "white" }}>&nbsp;{prod.cartLineID}</span>*/}
      </InStockProductCanAdd>
    )
  )));

  return (
    <>
      <ProductSearchBox />
      <PaginationLinks numPages={numPages} currPage={pageIntP} />
      {/* !inStockProdThisPage || inStockProdThisPage.length === 0 && <div className="fetchErr">( Search returned no results )</div> */}
      {markup}
      <PaginationLinks numPages={numPages} currPage={pageIntP} />
      {gotItems && <div style={{ marginTop: "20px" }}><ProceedCartBtn /></div>}
    </>
  );
}
export default Shop;