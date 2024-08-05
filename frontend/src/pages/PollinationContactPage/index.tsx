import { Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FormContainer from "../../components/FormContainer";
import { useState } from "react";

const PollinationContactPage: React.FC = () => {
  const { t } = useTranslation("pollination");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    address: "",
    surfaceArea: "",
    produce: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Container className="mx-5 mt-5">
            <h1>{t("quoteRequestTitle")}</h1>
            <p className="mt-3">{t("quoteDescription")}</p>
          </Container>
        </Col>
        <Col>
          <FormContainer className="mx-5 mt5 pt-5">
            <Form>
              <Form.Group controlId="name" className="mt-3">
                <Form.Label>{t("name")}</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  placeholder={t("namePlaceholder")}
                  value={formState.name}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="mt-3">
                <Form.Label>{t("email")}</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder={t("emailPlaceholder")}
                  value={formState.email}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="address" className="mt-3">
                <Form.Label>{t("address")}</Form.Label>
                <Form.Control
                  required
                  type="address"
                  name="address"
                  placeholder={t("addressPlaceholder")}
                  value={formState.address}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="surface" className="mt-3">
                <Form.Label>{t("surfaceArea")}</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="surfaceArea"
                  placeholder={t("surfaceAreaPlaceholder")}
                  value={formState.surfaceArea}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="produce" className="mt-3">
                <Form.Label>{t("produce")}</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="produce"
                  placeholder={t("producePlaceholder")}
                  value={formState.produce}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
            </Form>
          </FormContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default PollinationContactPage;
