
import { NavLink } from "react-router";
function CheckoutSuccess() {
  return (
    <>
      <h2 style={{ marginTop: "20px", marginBottom:"15px" }}>Thanks!</h2>
      <p className={"mb-4"}>Your order has been submitted. We'll ship your goods as soon as possible.</p>

      <NavLink to={"/"} className={"btn btn-primary"}>Continue Shopping</NavLink>
    </>
  );
}
export default CheckoutSuccess;