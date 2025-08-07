import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { axiosInstance } from '@/axiosDefault.jsx';

function AdminUserOrders()
{
  const { usertype, idval } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [idval]);

  async function fetchOrders() {
    setError("");
    //const path = ((usertype == "guest") ? "/api/admin-guest-orders/" : "/api/admin-user-orders/") + idval;
    const url = window.location.origin + "/api/admin-user-orders?idval=" + idval + "&usertype=" + usertype; 
    axiosInstance.get(url).then((response) => {
      //dispatch(setAdminUserOrders(response.data));
    })
    .catch((error) => {
      setError(error);
      //dispatch(setAdminUserOrders([]));
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <>
      AdminUserOrders
    </>
  );
}
export default AdminUserOrders;