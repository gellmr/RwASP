import { setSearch } from '@/features/search/searchSlice.jsx'
import { useDispatch, useSelector } from 'react-redux'
import SearchInput from "@/Search/SearchInput";

function ProductSearchBox()
{
  const search = useSelector(state => state.search.value);
  const dispatch = useDispatch();
  
  const handleSearchChange = (str) => {
    dispatch(setSearch(str));
    // Force pagination back to page 1 on any search change
    const pageIntP = page !== undefined ? Number.parseInt(page) : 1;
    if (pageIntP !== 1) {
       const catSeg = category !== undefined ? "category/" + category + "/" : "";
       navigate("/" + catSeg); // Root defaults to page 1
    }
  };

  return (
    <div>
      <SearchInput parentHandleInputChange={handleSearchChange} initVal={search} placeholder="Search for products" />
    </div>
  );
}

export default ProductSearchBox;