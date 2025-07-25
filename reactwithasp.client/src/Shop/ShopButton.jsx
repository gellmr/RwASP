import { NavLink } from "react-router";

function ShopButton({ withBackArrow })
{
  const backToShopMarkup = function (text) {
    return (
      <>
        <span className="mgAdminNavHideMD">Back to</span>&nbsp;Shop
      </>
    );
  }

  const iconElement = withBackArrow ? <i className="bi bi-arrow-left-short"></i> : <></>;
  const linkText = withBackArrow ? backToShopMarkup() : "Shop";

  return (
    <>
      <NavLink to="/" className="mgNavLinkBtn" style={{ textWrapMode: "nowrap" }}>
        <span style={{ minWidth:45, display: "inline-block", textAlign:"left" }}>
          {iconElement}
          {linkText}
        </span>
      </NavLink>
    </>
  );
}
export default ShopButton;