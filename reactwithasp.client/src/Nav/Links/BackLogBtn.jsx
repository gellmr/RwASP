import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function BackLogBtn({ orderCount }) {
  const markup = () => (
    <>Backlog</>
  );
  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={markup}
      toRoute="/admin/orders/1"
    />
  );
}
export default BackLogBtn;