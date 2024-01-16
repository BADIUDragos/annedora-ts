import React from "react";
import { Container, Row, Col } from "react-bootstrap";

interface IFormContainer {
  xs: number;
  md: number;
  children: React.ReactNode;
  className?: string;
}

const FormContainer: React.FC<IFormContainer> = ({xs, md, children, className }) => {
  return (
    <Container>
      <Row className={className}>
        <Col xs={xs} md={md}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
