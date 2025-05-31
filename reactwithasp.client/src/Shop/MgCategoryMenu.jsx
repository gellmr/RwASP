import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function MgCategoryMenu({ isVertical, propStyle, propClasses }) {
  return (
    <>
      <ButtonGroup vertical={isVertical} style={propStyle} className={propClasses} >
        <Button variant="primary">All Products</Button>
        <Button variant="default">Button</Button>
        <Button variant="default">Button</Button>
        <Button variant="default">Button</Button>
      </ButtonGroup>
    </>
  );
}

export default MgCategoryMenu;