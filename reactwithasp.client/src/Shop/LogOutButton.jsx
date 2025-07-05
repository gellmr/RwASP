import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux'
import { setLogin } from '@/features/login/loginSlice.jsx'
import axios from 'axios';
import axiosRetry from 'axios-retry';

function LogOutButton()
{
  const retryThisPage = 5;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Configure axios instance.
  axiosRetry(axios, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  const logoutClick = function () {
    const url = window.location.origin + "/api/admin-logout";
    axios.post(url).then((response) => {
      console.log("------------------------------");
      console.log('Logout success. ', response.data);
      dispatch(setLogin(""));
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
      <NavLink to="/admin-logout" className="mgNavLinkBtn" onClick={logoutClick}>Logout</NavLink>
    </>
  );
}
export default LogOutButton;