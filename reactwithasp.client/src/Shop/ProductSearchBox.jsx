import { setSearch } from '@/features/search/searchSlice.jsx'
import { useDispatch, useSelector } from 'react-redux'
import SearchInput from "@/Search/SearchInput";

function ProductSearchBox()
{
  const search = useSelector(state => state.search.value);
  const dispatch = useDispatch();
  
  const handleSearchChange = (str) => {
    dispatch(setSearch(str));
  };

  return (
    <div>
      <SearchInput parentHandleInputChange={handleSearchChange} initVal={search} placeholder="Search for products" />
    </div>
  );
}

export default ProductSearchBox;