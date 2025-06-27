import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import GoogleLoginComp from "@/Admin/GoogleLoginComp.jsx";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

function AdminLogin() {  
  return (
    <>
      <h4>Admin Login</h4>
      <div style={{ display:"flex", justifyContent:"center"}}>
        <Form style={{ marginTop: 30, marginBottom:50, maxWidth:600}}>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
export default AdminLogin;