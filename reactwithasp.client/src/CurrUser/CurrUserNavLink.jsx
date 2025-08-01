import LogInButton from "@/Shop/LogInButton";
import LogOutButton from "@/Shop/LogOutButton";
import { useSelector } from 'react-redux'

function CurrUserNavLink()
{
  const login = useSelector(state => state.login.value);
  const isLoggedIn = (login !== null);

  const loginOutBtn = function () {
    const markup = (isLoggedIn) ? <LogOutButton /> : <LogInButton />;
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