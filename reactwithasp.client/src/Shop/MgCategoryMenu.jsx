import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

//function MgCategoryMenu({ isVertical, propStyle, propClasses }) {
function MgCategoryMenu({ isVertical }) {
  return (
    <>
      <ButtonGroup vertical={isVertical} className="mg-category-menu-r">
        <Button variant="primary">All Products</Button>
        <Button variant="default">Button</Button>
        <Button variant="default">Button</Button>
        <Button variant="default">Button</Button>
      </ButtonGroup>
    </>
  );
}

export default MgCategoryMenu;