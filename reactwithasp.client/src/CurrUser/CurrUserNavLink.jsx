import LogOutButton from "@/Shop/LogOutButton";
import { useSelector } from 'react-redux'
import { NavLink } from "react-router";

function CurrUserNavLink()
{
  const login = useSelector(state => state.login.value);

  const loginOutBtn = function () {
    const markup = (login === "") ? <NavLink to="/admin" className="mgNavLinkBtn" >Login</NavLink> : <LogOutButton />;
    return (
      <>
        {markup}
      </>
    );
  }

  return (
    <div className="mgCurrUserNav">
      {/*<a className="mgNavLinkBtn">Current&nbsp;User</a>*/}
      {loginOutBtn()}
    </div>
  );
}
export default CurrUserNavLink;