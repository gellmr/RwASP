import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function BiBtn()
{
  const markup = () => (
    <>BI</>
  );
  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={markup}
      toRoute="/admin/bi"
    />
  );
}
export default BiBtn;
