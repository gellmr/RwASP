import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function ProductsBtn({ orderCount })
{
  const markup = () => (
    <>Products</>
  );
  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={markup}
      markup={markup}
      toRoute="/admin/products"
    />
  );
}
export default ProductsBtn;