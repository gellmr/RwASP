import { useParams } from 'react-router';
import { useSelector} from 'react-redux'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductSearchBox() {
  const { category } = useParams();
  const categories = useSelector(state => state.categories.value); 
  const storeCat = categories.find((cat) => cat.segment === category);
  const displayCat = category === undefined ? "All" : storeCat.title;
  return (
    <div>
      <h6 style={{color:'grey', textAlign:"left"}}>Category: {displayCat}</h6>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          placeholder="Search (Feature under construction)"
          aria-label="SearchString"
          aria-describedby="basic-addon1"
        />
        <InputGroup.Text><i className="bi bi-x-lg"></i></InputGroup.Text>
      </InputGroup>
    </div>
  );
}

export default ProductSearchBox;