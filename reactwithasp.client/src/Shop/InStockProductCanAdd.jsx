import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "@/App.css";

function InStockProductCanAdd({ children }) {
  return (
    <Row style={{ border: '1px solid grey' }}>
      <Col xs={12} className="inStockProductCanAdd">
        {children}
        <Button variant="success">Add to Cart</Button>
      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;