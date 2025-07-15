import { NavLink } from "react-router";
import Button from 'react-bootstrap/Button';

function LogInButton() {
  return (
    <>
      <NavLink to="/admin" className="mgNavLinkBtn">
        Admin Login
      </NavLink>
    </>
  );
}
export default LogInButton;