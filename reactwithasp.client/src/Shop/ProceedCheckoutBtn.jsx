import { NavLink } from "react-router";

function ProceedCheckoutBtn() {
  return (
    <>
      <NavLink to="/checkout" className={"btn btn-primary"}>
        <span className="d-none d-sm-inline-block">Proceed to&nbsp;</span>Checkout&nbsp;<i className="bi bi-arrow-right-circle"></i>
      </NavLink>
    </>
  );
}
export default ProceedCheckoutBtn;