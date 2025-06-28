import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import GoogleLoginComp from "@/Admin/GoogleLoginComp.jsx";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function AdminLogin() {  
  return (
    <>
      <h4>Admin Login</h4>
      <h6 className="mg-construction-red">
        <span style={{ position: "relative", top: -4 }}>
          <i className="bi bi-wrench" style={{ position: 'relative', top:4 }}></i>
          &nbsp;
          (This page is Under Construction)
          &nbsp;
          &nbsp;
        </span>
      </h6>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form className="mg-admin-login-form">
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupEmail" style={{ textAlign:"left"}}>
                <Form.Label>&nbsp;&nbsp;Email address</Form.Label>
                <Form.Control type="email" placeholder="Please enter your email address" />
              </Form.Group>
            </Col>
            <Col xs={12} md={6} style={{marginBottom:40}}>
              <Form.Group className="mb-3" controlId="formGroupPassword" style={{ textAlign: "left" }}>
                <Form.Label>&nbsp;&nbsp;Password</Form.Label>
                <InputGroup>
                  <Form.Control type="password" placeholder="Enter your password" />
                  <Button variant="outline-primary" style={{minWidth:90}}>Login</Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Stack direction="horizontal" gap={3} className="d-none d-sm-flex" style={{marginTop:10}}>
              <div className="me-auto">Other sign-in options:</div>
              <div className="vr" />
              <GoogleLoginComp />
            </Stack>
            <Stack direction="vertical" className="d-flex d-sm-none" style={{ marginTop: 10 }}>
              <div className="me-auto"></div>
              <div style={{ maxWidth: 250, alignSelf: "flex-start" }}>
                Other sign-in options...
              </div>
              <hr />
              <div style={{ maxWidth: 250, alignSelf: "flex-end" }}>
                <GoogleLoginComp />
              </div>
            </Stack>
          </Row>
        </Form>
      </div>
    </>
  );
}
export default AdminLogin;