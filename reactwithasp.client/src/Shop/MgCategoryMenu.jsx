import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from "react-router";
import { useParams } from 'react-router';

function MgCategoryMenu({ isVertical = false, children })
{
  const { category } = useParams();
  const allProdStyles = (category === undefined) ? "btn btn-light active" : "btn btn-light";

  return (
    <>
      <ButtonGroup vertical={isVertical} className="mg-category-menu-r">
        <NavLink to={"/"} key={crypto.randomUUID()} data-catid={0} className={allProdStyles}>All Products</NavLink>
        {children}
      </ButtonGroup>
    </>
  );
}
export default MgCategoryMenu;