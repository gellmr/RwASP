//import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { NavLink } from "react-router";

function PaginationLinks({ numPages, currPage="1" })
{
  const listItems = Array.from({ length: numPages }).map((_, index) => (
    <NavLink to={"/index/" + (index + 1)} key={index + 1} className={(Number.parseInt(currPage) === index + 1) ? "btn btn-primary" : "btn btn-default"}>
      {index + 1}
    </NavLink>
  ));

  return (
    <ButtonToolbar aria-label="Toolbar with button groups">
      <ButtonGroup className="me-2" aria-label="First group">
        {listItems}
      </ButtonGroup>
    </ButtonToolbar>
  );
}

export default PaginationLinks;