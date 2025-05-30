import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function InStockProductCanAdd({ children }) {
  return (
    <Row style={{ border: '1px solid grey' }}>
      <Col xs={12}>
        {children}
        <Button>Add to Cart</Button>
      </Col>
    </Row>
  );
}

export default InStockProductCanAdd;