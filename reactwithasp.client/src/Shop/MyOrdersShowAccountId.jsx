import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function MyOrdersShowAccountId({ accType, idval })
{
  return (
    <Col xs={12} className="myOrdRow">
      <Row>
        <Col xs={4} sm={3} className="">{accType} ID:</Col>
        <Col xs={8} sm={9} className="guid">{idval}</Col>
      </Row>
    </Col>
  );
}

export default MyOrdersShowAccountId;