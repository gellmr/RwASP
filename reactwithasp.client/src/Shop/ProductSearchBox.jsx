import { setSearch } from '@/features/search/searchSlice.jsx'
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductSearchBox()
{
  const { category } = useParams();
  const categories = useSelector(state => state.categories.value);
  const search = useSelector(state => state.search.value);
  const dispatch = useDispatch(); // Redux dispatch
  const storeCat = (categories !== undefined && categories.length > 0) ? categories.find((cat) => cat.segment === category) : undefined;
  const displayCat = (category === undefined || storeCat === undefined) ? "All" : storeCat.title;

  const handleInputChange = (e) => {
    console.log("typing " + e.target.value);
    dispatch(setSearch(e.target.value));
  };

  const handleXClicked = (e) => {
    dispatch(setSearch(""));
  };

  return (
    <div>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          name="searchStringInput"
          placeholder="Search for products"
          value={search}
          aria-label="SearchString"
          aria-describedby="basic-addon1"
          onChange={handleInputChange}
        />
        <InputGroup.Text className="searchXBtn" onClick={handleXClicked}>
          <i className="bi bi-x-lg"></i>
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
}

export default ProductSearchBox;