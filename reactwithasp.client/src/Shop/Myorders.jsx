import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Myorders = () => {
  return (
    <>
      <Row style={{height:650}}>
        <Col xs={12}>
          <AdminTitleBar titleText="My Orders" />
        </Col>

        <Col xs={12}>
          <div>Order 1</div>
          <div>Order 2</div>
          <div>Order 3</div>
          <div>Order 4</div>
          <div>Order 5</div>
          <br />
          <div>Order 1</div>
          <div>Order 2</div>
          <div>Order 3</div>
          <div>Order 4</div>
          <div>Order 5</div>
          <br />
        </Col>
      </Row>
    </>
  );
}
export default Myorders;