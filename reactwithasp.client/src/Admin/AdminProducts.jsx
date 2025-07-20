import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import AdminTitleBar from "@/Admin/AdminTitleBar";

const AdminProducts = () =>
{
  const retryThisPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminProducts = [{id:123}];

  const axiosInstance = axios.create({});
  axiosRetry(axiosInstance, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`); 
  }});

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  async function fetchAdminProducts() {
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-products";
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)                  ? <div className="fetchErr">Error: {error.message}</div> : (
    adminProducts && adminProducts.map(prod =>
      <div>{prod.id}</div>
    )
  ));

  return (
    <>
      <AdminTitleBar titleText="Products" />
      {markup}
    </>
  );
}
export default AdminProducts;