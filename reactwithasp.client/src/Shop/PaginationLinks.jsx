import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function PaginationLinks({ numPages })
{
  const listItems = Array.from({ length: numPages }).map((_, index) => (
    <Button key={index} variant={(index === 0) ? "primary" : "default"}>
      {index + 1}
    </Button>
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