import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap-icons/font/bootstrap-icons.css";

function SearchInput({ parentHandleInputChange, initVal="", placeholder="Search"})
{
  const handleInputChange = (e) => {
    parentHandleInputChange(e.target.value);
  };

  const handleXClicked = (e) => {
    parentHandleInputChange("");
  };

  return (
    <div>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          <i className="bi bi-search"></i>
        </InputGroup.Text>

        <Form.Control
          name="searchInput"
          placeholder={placeholder}
          value={initVal}
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
export default SearchInput;