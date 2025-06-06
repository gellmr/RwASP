import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from "react-router";
function MgCategoryMenu({ isVertical=false, children }) {
  return (
    <>
      <ButtonGroup vertical={isVertical} className="mg-category-menu-r">
        <NavLink to={"/"} key={crypto.randomUUID()} data-catid={0} className={"btn btn-light"}>All Products</NavLink>
        {children}
      </ButtonGroup>
    </>
  );
}
export default MgCategoryMenu;