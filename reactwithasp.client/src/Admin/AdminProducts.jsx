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

  const prodRowMarkup = (prod) => (
    <Col xs={12} className="adminProductRow" key={prod.id}>
      <Row>
        <Col className="adminProductCell" xs={4}>Product ID</Col>  <Col xs={8} className="adminProductCell">{prod.id}</Col>
        <Col className="adminProductCell" xs={4}>Title</Col>       <Col xs={8} className="adminProductCell">{prod.title}</Col>
        <Col className="adminProductCell" xs={4}>Price</Col>       <Col xs={8} className="adminProductCell">{prod.price}</Col>
        <Col className="adminProductCell" xs={4}>Image</Col>       <Col xs={8} className="adminProductCell">{prod.image}</Col>
        <Col className="adminProductCell" xs={4}>Description</Col> <Col xs={8} className="adminProductCell">{prod.description}</Col>
        <Col className="adminProductCell" xs={4}>Category</Col>    <Col xs={8} className="adminProductCell">{prod.category}</Col>
      </Row>
    </Col>
  );

  const prodTableMarkup = () => (
    <>
      <Row>
        <Col xs={0} lg={2}>
          {/*LSPACE*/}
        </Col>
        <Col xs={12} lg={8}>
          {adminProducts.map(prod => prodRowMarkup(prod))}
        </Col>
        <Col xs={0} lg={2}>
          {/*RSPACE*/}
        </Col>
      </Row>
    </>
  );

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)                  ? <div className="fetchErr">Error: {error.message}</div> : (
    prodTableMarkup()
  ));

  return (
    <>
      <Row>
        <Col xs={12}>
          <AdminTitleBar titleText="Products" />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminProducts;