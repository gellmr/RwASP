import LogOutButton from "@/Shop/LogOutButton";

function CurrUserNavLink() {
  return (
    <div className="mgCurrUserNav">
      <a className="mgNavLinkBtn">Current&nbsp;User</a>
      <LogOutButton />
    </div>
  );
}
export default CurrUserNavLink;