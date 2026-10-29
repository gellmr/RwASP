import { NavLink } from "react-router";
function LogoutSuccess()
{
  return (
    <div className="logoutThanks" style={{minHeight:700}}>
      <h2 style={{marginTop:5, marginBottom:11}}>Thanks!</h2>
      <h5 className="mb-4">You have successfully logged out.</h5>
      <NavLink to={"/"} className={"btn btn-primary"}>Back to Shop</NavLink>
    </div>
  );
}
export default LogoutSuccess;
