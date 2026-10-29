import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function HistBtn()
{
  const markup = () => (
    <>History</>
  );
  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={markup}
      toRoute="/admin/hist"
    />
  );
}
export default HistBtn;
