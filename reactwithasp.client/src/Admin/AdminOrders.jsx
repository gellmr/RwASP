import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ConstructionBanner from "@/main/ConstructionBanner.jsx";

function AdminOrders()
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Configure axios instance.
  axiosRetry(axios, { retries: 7, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders()
  { 
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-orders";
    const jsonData = {};
    axios.get(url, jsonData).then((response) => {
      console.log('Data fetched:', response.data);
    })
    .catch((err) => {
      setError(err.response.data.loginResult);
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const errMarkup = (
    <>
      {error && <span>Error: {error}</span>}
    </>
  );

  const loadingMarkup = (
    <>
      <div className="fetchErr">Loading...</div>
    </>
  );

  const pageMarkup = (
    <>
      Orders will appear here.
    </>
  );

  return (
    <>
      <h4>Admin Orders</h4>
      <ConstructionBanner />
      <div style={{ display: "flex", justifyContent: "center" }}>
        { isLoading ? loadingMarkup : ( error ? errMarkup : pageMarkup ) }
      </div>
    </>
  );
}
export default AdminOrders;