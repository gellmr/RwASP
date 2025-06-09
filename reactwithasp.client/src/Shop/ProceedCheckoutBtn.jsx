import { NavLink } from "react-router";

function ProceedCheckoutBtn() {
  return (
    <>
      <NavLink to="/checkout" className={"btn btn-primary"}>Proceed to Checkout&nbsp;<i className="bi bi-arrow-right-circle"></i></NavLink>
    </>
  );
}
export default ProceedCheckoutBtn;