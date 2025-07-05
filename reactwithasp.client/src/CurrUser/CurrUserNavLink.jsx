import LogOutButton from "@/Shop/LogOutButton";

function CurrUserNavLink()
{

  const loginOutBtn = function () {
    return (
      <>
        <LogOutButton />
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