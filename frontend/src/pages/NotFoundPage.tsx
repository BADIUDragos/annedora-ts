import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { Card, Container } from "react-bootstrap";

const NotFoundPage: React.FC = () => {

  return (
    <>
      <FormContainer xs={12} md={6} className="mt-5 justify-content-md-center">
        <Card border="gray" className="mb-3">
          <Card.Header
            style={{
              fontSize: "2.5em",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Oops!<span>404 Page not found</span>
          </Card.Header>
          
          <Card.Body>
          <Card.Title>This page doesn't exist.</Card.Title>
            <Card.Text>
              Click <Link to={"/"}>here</Link> to go back to the home page !
            </Card.Text>
            <Container className="d-flex justify-content-center">
              <Card.Img
                variant="top"
                src="/images/notFound404.jpg"
                className="w-75"
              />
            </Container>
          </Card.Body>
        </Card>
      </FormContainer>
    </>
  );
};

export default NotFoundPage;
