import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { setCategories, setNoCategories } from '@/features/categories/categoriesSlice.jsx'
import Col from 'react-bootstrap/Col'
import { NavLink } from "react-router";
import MgCategoryMenu from "@/Shop/MgCategoryMenu";
import CatCaret from "@/Shop/CatCaret";
import "bootstrap/dist/css/bootstrap.css";

function CategoriesMenu()
{
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = useSelector(state => state.categories.value); // Array of categories
  const dispatch = useDispatch(); // Redux dispatch

  // Configure this axios instance. 3 retries is about minimum for Vite load on my workstation.
  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const url = 'api/categories';
    console.log("Axios retry..." + url);
    axios.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setCategories(response.data)); // response.data is already JSON
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      dispatch(setNoCategories()); // Failed to load categories
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const menuMarkup = (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div>Error: {error.message}</div> : (
    categories && categories.map(cat =>
    <NavLink to={"/category/" + cat.segment} key={crypto.randomUUID()} data-catid={cat.id} className={"btn btn-light"}>
      <CatCaret />
      {cat.title}
    </NavLink>
    )
  ));

  return (
    <>
      <Col className="d-block d-sm-none" style={{ border: '', padding: "0px" }}>
        <MgCategoryMenu isVertical={true}>{menuMarkup}</MgCategoryMenu>
      </Col>
      <Col className="d-none d-sm-block d-md-none" style={{ border: '', padding: "0px" }}>
        <MgCategoryMenu>{menuMarkup}</MgCategoryMenu>
      </Col>
      <Col className="d-none d-md-block col-md-3" style={{ border: '', padding: "0px" }}>
        <MgCategoryMenu isVertical={true}>{menuMarkup}</MgCategoryMenu>
      </Col>
    </>
  );
}
export default CategoriesMenu;