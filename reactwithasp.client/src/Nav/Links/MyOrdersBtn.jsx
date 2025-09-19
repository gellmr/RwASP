import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function MyOrdersBtn({ orderCount }) {
  
  const tinyMarkup = () => (
    <>Orders{orderCount}</>
  );

  const markup = () => (
    <>
      {/* &nbsp;<i className="bi bi-box-seam"></i> */}
      My&nbsp;Orders{orderCount}
    </>
  );

  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={tinyMarkup}
      markup={markup}
      toRoute="/myorders"
    />
  );
}
export default MyOrdersBtn;