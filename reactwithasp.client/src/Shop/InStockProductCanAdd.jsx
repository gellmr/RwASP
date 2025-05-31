import { useProductsDispatch } from '@/Shop/ProductsContext';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({ title, slug, productId }) {
  const dispatch = useProductsDispatch();
  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">

        <Row>
          <Col xs={12} sm={9}>
            <div className="productDetails">
              <h5>{title}</h5>
              <span>{slug}&nbsp;productId:{productId}</span>
            </div>
          </Col>
          <Col xs={12} sm={3} className="flexContAddToCart">
            <Button variant="success" onClick={ ()=>{dispatch({type:'add',id:productId})} }>Add to Cart</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;