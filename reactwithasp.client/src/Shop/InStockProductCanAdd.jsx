import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({title, slug }) {
  return (
    <Row className="inStockProductCanAdd">
      <Col xs={12} className="productDetailsFlex">
        <div className="productDetails">
          <h5>{title}</h5>
          <span>{slug}</span>
        </div>
        <Button variant="success">Add to Cart</Button>
      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;