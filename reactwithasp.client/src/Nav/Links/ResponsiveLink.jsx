import { NavLink, useLocation } from "react-router";

function ResponsiveLink({ clickCallBack=null, tinyMarkup, smallMarkup, markup, toRoute, extraStyle={} })
{
  const location = useLocation();

  const handleClick = function () {
    if (clickCallBack) {
      clickCallBack();
    }
  }
  
  // Determine if current URL is any Shop page (/, /2, /category/..., etc.)
  const isShopRoute = location.pathname === '/' 
    || /^\/\d+$/.test(location.pathname) 
    || location.pathname.startsWith('/category/');

  // Return 'active' if we are on a shop route like
  // https://site
  // https://site/2 
  // https://site/category/soccer
  // https://site/category/soccer/2 
  const getActive = () => (toRoute === '/' ? isShopRoute : location.pathname === toRoute) ? 'active' : '';

  const activeClass = getActive();
  
  return (
    <>
      <NavLink onClick={handleClick} to={toRoute} className={`${activeClass} useResponsiveLink tiny d-inline-block d-sm-none`}                           style={extraStyle}>{smallMarkup}</NavLink>
      <NavLink onClick={handleClick} to={toRoute} className={`${activeClass} useResponsiveLink mid  d-none         d-sm-inline-block d-lg-none`}         style={extraStyle}>{smallMarkup}</NavLink>
      <NavLink onClick={handleClick} to={toRoute} className={`${activeClass} useResponsiveLink lar  d-none                           d-lg-inline-block`} style={extraStyle}>{markup}</NavLink>
    </>
  );
}
export default ResponsiveLink;
