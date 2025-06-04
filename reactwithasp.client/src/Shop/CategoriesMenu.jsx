import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setCategories, setNoCategories } from '@/features/categories/categoriesSlice.jsx'
import Col from 'react-bootstrap/Col'
import { NavLink } from "react-router";
import MgCategoryMenu from "@/Shop/MgCategoryMenu";
import "bootstrap/dist/css/bootstrap.css";

function CategoriesMenu()
{
  const categories = useSelector(state => state.categories.value); // Array of categories
  const dispatch = useDispatch(); // Redux dispatch

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch('api/categories');
      const data = await response.json();
      dispatch(setCategories(data));
    } catch (err) {
      dispatch(setNoCategories());
    }
  }

  const menuMarkup = (categories === undefined || categories.length === 0)
    ? <div className="fetchErr">Please wait for Vite to load and then refresh browser.</div>
    : categories && categories.map(cat =>
      <NavLink to={"/" + cat.segment} key={crypto.randomUUID()} data-catid={cat.id}>{cat.title}</NavLink>
    );

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