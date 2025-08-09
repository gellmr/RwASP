import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router";

function BackLink({ children, textPos })
{
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Row>
      <Col style={{ textAlign: textPos, marginBottom: 10 }}>
        <Button onClick={handleGoBack} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', fontSize: 12 }}>
          <i className="bi bi-arrow-left-short"></i> Back
        </Button>
      </Col>
    </Row>
  );
}
export default BackLink;