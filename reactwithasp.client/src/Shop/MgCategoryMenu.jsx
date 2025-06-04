import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function MgCategoryMenu({ isVertical=false, children }) {
  return (
    <>
      <ButtonGroup vertical={isVertical} className="mg-category-menu-r">
        <Button variant="primary">All Products</Button>
        {children}
      </ButtonGroup>
    </>
  );
}

export default MgCategoryMenu;