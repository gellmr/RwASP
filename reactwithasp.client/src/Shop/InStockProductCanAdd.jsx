import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({title, slug }) {
  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">

        <Row>
          <Col xs={12} sm={9}>
            <div className="productDetails">
              <h5>{title}</h5>
              <span>{slug}</span>
            </div>
          </Col>
          <Col xs={12} sm={3} className="flexContAddToCart">
            <Button variant="success">Add to Cart</Button>
          </Col>
        </Row>

      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;