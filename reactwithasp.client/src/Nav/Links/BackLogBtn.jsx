import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function BackLogBtn({ orderCount })
{
  const tinyContent = <>Orders Backlog</>;
  const markup = <>Backlog</>;

  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={tinyContent}
      toRoute="/admin/orders/1"
    />
  );
}
export default BackLogBtn;