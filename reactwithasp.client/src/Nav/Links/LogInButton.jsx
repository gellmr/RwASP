import { NavLink } from "react-router";
import Button from 'react-bootstrap/Button';

function LogInButton() {
  return (
    <>
      <NavLink to="/admin" className="mgNavLinkBtn" style={{ textWrapMode:"nowrap" }}>
        Admin <i className="bi bi-gear-fill"></i>
      </NavLink>
    </>
  );
}
export default LogInButton;