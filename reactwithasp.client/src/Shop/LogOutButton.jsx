import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux'
import { setLogin } from '@/features/login/loginSlice.jsx'
import { axiosInstance } from '@/axiosDefault.jsx';

function LogOutButton()
{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutClick = function () {
    const url = window.location.origin + "/api/admin-logout";
    axiosInstance.post(url).then((response) => {
      console.log("------------------------------");
      console.log('Logout success. ', response.data);
      dispatch(setLogin(null));
      console.log("Navigate to /");
      navigate('/');
    })
    .catch((err) => {
      debugger;
    })
    .finally(() => {
      console.log('(logoutClick) Request (and retries) completed.');
    });
  };

  return (
    <>
      <NavLink to="/admin-logout" className="mgNavLinkBtn mgAdminNavLinks" onClick={logoutClick} style={{ textWrapMode:"nowrap" }}>
        Logout
        <span className="mgAdminNavHideMD">&nbsp;Admin</span>
      </NavLink>
    </>
  );
}
export default LogOutButton;