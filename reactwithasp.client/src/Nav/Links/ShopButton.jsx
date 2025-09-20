import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function ShopButton({ withBackArrow=false})
{
  const iconElement = withBackArrow ? <>
    <i className="bi bi-arrow-left-short"></i>&nbsp;
  </> : <></>;
  const text = "Shop";
  const longText = withBackArrow ? <>Back&nbsp;to&nbsp;Shop</> : "Shop";

  const tinyContent  = <>{iconElement}{longText}</>;
  const smallContent = <>{iconElement}{text}</>;
  const content      = <>{iconElement}{longText}</>;

  const tinyMarkup = () => (
    <>{tinyContent}</>
  );

  const smallMarkup = () => (
    <>{smallContent}</>
  );

  const markup = () => (
    <>{content}</>
  );

  return (
    <ResponsiveLink
      tinyMarkup={tinyMarkup}
      smallMarkup={smallMarkup}
      markup={markup}
      toRoute="/"
    />
  );
}
export default ShopButton;