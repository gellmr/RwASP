import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CartBar from "@/Shop/CartBar";

function Checkout() {

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <h2 style={{ marginTop: "5px" }}>Checkout</h2>
      <div className="col-12">
        <Row>
          <CartBar />
          <Col className="checkoutLines">

            <div className="shipHeading">Please provide your details below, and we'll ship your goods right away.</div>

            <Form onSubmit={handleSubmit}>
            <h5 className="shipHeading">Please provide your name...</h5>
            <InputGroup className="mb-3">
              <InputGroup.Text>First Name</InputGroup.Text>
              <Form.Control id="shipFirstName" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Last Name</InputGroup.Text>
              <Form.Control id="shipLastName" />
            </InputGroup>

            <h5 className="shipHeading">Shipping Address</h5>
            <InputGroup className="mb-3">
              <InputGroup.Text>Line 1</InputGroup.Text>
              <Form.Control id="shipLine1"/>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Line 2</InputGroup.Text>
              <Form.Control id="shipLine2" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Line 3</InputGroup.Text>
              <Form.Control id="shipLine3" />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>City</InputGroup.Text>
              <Form.Control id="shipCity" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>State</InputGroup.Text>
              <Form.Control id="shipState" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Country</InputGroup.Text>
              <Form.Control id="shipCountry" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Zip</InputGroup.Text>
              <Form.Control id="shipZip" />
            </InputGroup>

            <h5 className="shipHeading">Your Email Address</h5>
            <InputGroup className="mb-5">
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control id="shipEmail" />
            </InputGroup>

            <Button variant="success" className={"btn btn-primary"} type="submit" >Complete Order</Button>
            </Form>

          </Col>
          <CartBar />
        </Row>
      </div>
    </>
  );
}
export default Checkout;