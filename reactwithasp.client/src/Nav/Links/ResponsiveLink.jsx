import { NavLink } from "react-router";

function ResponsiveLink({ clickCallBack=null, tinyMarkup, smallMarkup, markup, toRoute, extraStyle={minWidth:45, textAlign:"left"} })
{
  const handleClick = function () {
    if (clickCallBack) {
      clickCallBack();
    }
  }
  return (
    <>
      <NavLink onClick={handleClick} to={toRoute} className="useResponsiveLink xs d-inline-block d-sm-none"           style={extraStyle}>{tinyMarkup}</NavLink>
      <NavLink onClick={handleClick} to={toRoute} className="useResponsiveLink sm d-none d-sm-inline-block d-md-none" style={extraStyle}>{smallMarkup}</NavLink>
      <NavLink onClick={handleClick} to={toRoute} className="useResponsiveLink md d-none d-sm-none d-md-inline-block" style={extraStyle}>{markup}</NavLink>
    </>
  );
}
export default ResponsiveLink;