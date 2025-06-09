import { NavLink } from "react-router";

function ProceedCartBtn() {
  return (
    <>
      <NavLink to="/cart" className={"btn btn-primary"}>Go to Cart&nbsp;<i className="bi bi-arrow-right-circle"></i></NavLink>
    </>
  );
}
export default ProceedCartBtn;