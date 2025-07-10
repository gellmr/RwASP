import { NavLink } from "react-router";

function ShopButton({ withBackArrow })
{
  const iconElement = withBackArrow ? <i className="bi bi-arrow-left-short"></i> : <></>;
  const linkText = withBackArrow ? "Back to Shop" : "Shop";

  return (
    <>
      <NavLink to="/" className="mgNavLinkBtn">
        {iconElement}
        {linkText}
      </NavLink>
    </>
  );
}
export default ShopButton;