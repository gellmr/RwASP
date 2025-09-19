import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function AdminPagesBtn({ orderCount }) {

  const tinyMarkup = () => (
    <>Admin</>
  );

  const markup = () => (
    <>Admin&nbsp;Console</>
  );

  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={tinyMarkup}
      markup={markup}
      toRoute="/admin/orders/1"
    />
  );
}
export default AdminPagesBtn;