import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function CustAccountsBtn({ orderCount }) {
  const tinyMarkup = () => (<>Accounts</>);
  const markup = () => (<>Customer&nbsp;Accounts</>);
  return (
    <ResponsiveLink
      tinyMarkup={markup}
      smallMarkup={tinyMarkup}
      markup={markup}
      toRoute="/admin/useraccounts"
    />
  );
}
export default CustAccountsBtn;