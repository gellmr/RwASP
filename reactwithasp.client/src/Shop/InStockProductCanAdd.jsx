import { useCartDispatch } from '@/Shop/CartContext';
import { useInStockProducts } from '@/Shop/InStockContext';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({ title, slug, productId }) {
  const inStockProducts = useInStockProducts();
  const cartDispatch = useCartDispatch();
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
            <Button variant="success" onClick={() => {
              debugger;
              const product = inStockProducts.find(p => p.id === productId); // Get the in stock product
              cartDispatch({ type: 'add', id: productId, product: product }); // Add the item to Cart
              // cartDispatch({ type: 'add', id: productId }); // Add the item to Cart
            }}>Add to Cart</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;