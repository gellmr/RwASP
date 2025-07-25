import { useParams } from 'react-router';

function MyOrderDetail() {
  const { orderid } = useParams();
  return (
    <>
      My Order Detail {orderid}
    </>
  );
}
export default MyOrderDetail;