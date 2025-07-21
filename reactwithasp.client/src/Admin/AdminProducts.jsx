import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminProducts } from '@/features/admin/products/adminProductsSlice.jsx'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';

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
    <Row className="adminProductRow" key={prod.id}>
      <Col xs={4} className="adminProductCell d-none d-sm-block adminProdImage">
        <Image src={prod.image} rounded />
      </Col>
      <Col xs={12} sm={8}>
        <Row className="adminProductDetailsBox">
          <Col className="adminProductCell" xs={4}>Product ID</Col>  <Col xs={8} className="adminProductCell">{prod.id}</Col>
          <Col className="adminProductCell" xs={4}>Title</Col>       <Col xs={8} className="adminProductCell">{prod.title}</Col>
          <Col className="adminProductCell" xs={4}>Category</Col>    <Col xs={8} className="adminProductCell">{prod.category}</Col>
          <Col className="adminProductCell" xs={4}>Price</Col>       <Col xs={8} className="adminProductCell">{(prod.price).toFixed(2)}</Col>
          <Col className="adminProductCell" xs={4}>Description</Col> <Col xs={8} className="adminProductCell">{prod.description}</Col>
        </Row>
      </Col>
      <Col xs={12} className="adminProductCell d-sm-none adminProdImage">
        <Image src={prod.image} rounded />
      </Col>
    </Row>
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
          <AdminTitleBar titleText="Products" construction={false} />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminProducts;