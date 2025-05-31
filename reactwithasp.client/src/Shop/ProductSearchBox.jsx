import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductSearchBox() {
  return (
    <div>
      <h6 style={{color:'grey', textAlign:"left"}}>Category: All</h6>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          placeholder="SearchString"
          aria-label="SearchString"
          aria-describedby="basic-addon1"
        />
        <InputGroup.Text><i className="bi bi-x-lg"></i></InputGroup.Text>
      </InputGroup>
    </div>
  );
}

export default ProductSearchBox;