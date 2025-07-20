import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminProducts } from '@/features/admin/products/adminProductsSlice.jsx'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const AdminProducts = () =>
{
  const retryThisPage = 5;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminProducts = useSelector(state => state.adminProducts.value);

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
      dispatch(setAdminProducts(response.data));
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      dispatch(setAdminProducts([]));
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const prodRowMarkup = ( prod ) => (
    <Col xs={12} key={prod.id}>
      <table style={{ width: "100%", textAlign: "left" }}>
        <tbody>
          <tr>
            <td>Product ID</td>
            <td>{prod.id}</td>
          </tr>
        </tbody>
      </table>
    </Col>
  );

  const prodTableMarkup = (prod) => (
    <Row>
      {adminProducts.map(prod => prodRowMarkup(prod))}
    </Row>
  );

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)                  ? <div className="fetchErr">Error: {error.message}</div> : (
    prodTableMarkup()
  ));

  return (
    <>
      <AdminTitleBar titleText="Products" />
      {markup}
    </>
  );
}
export default AdminProducts;