import ResponsiveLink from '@/Nav/Links/ResponsiveLink';

function CustAccountsBtn({ orderCount }) {
  const tinyMarkup = () => (<>Accounts</>);
  const smallMarkup = () => (<>Accounts</>);
  const markup = () => (<>Customer&nbsp;Accounts</>);
  return (
    <ResponsiveLink
      tinyMarkup={tinyMarkup}
      smallMarkup={smallMarkup}
      markup={markup}
      toRoute="/admin/useraccounts"
    />
  );
}
export default CustAccountsBtn;