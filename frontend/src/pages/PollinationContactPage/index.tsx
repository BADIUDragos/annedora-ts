import { Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FormContainer from "../../components/FormContainer";
import { useState, useEffect } from "react";
import { useMakeContactMutation } from "../../store/apis/contactApi";
import { ContactState } from "../../store/interfaces/contactInterface";
import Loader from "../../components/Loader";
import BeeButton from "../../components/BeeButton";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const PollinationContactPage: React.FC = () => {
  const { t } = useTranslation("pollination");
  const navigate = useNavigate();

  const [makeContact, { isLoading, isSuccess, error }] =
    useMakeContactMutation();

  const [formData, setFormData] = useState<ContactState>({
    name: "",
    email: "",
    address: "",
    surfaceArea: "",
    produce: "",
  });

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please complete the CAPTCHA verification.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("recaptcha_token", captchaValue);

    await makeContact(data);
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [isSuccess, navigate]);

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
          {isSuccess ? (
            <Container className="mx-5 mt-5 pt-5">
              <h1>{t("thankYou")}</h1>
              <p>{t("redirectMessage")}</p>
            </Container>
          ) : (
            <FormContainer className="mx-5 mt5 pt-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mt-3">
                  <Form.Label>{t("name")}</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    placeholder={t("namePlaceholder")}
                    value={formData.name}
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
                    value={formData.email}
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
                    value={formData.address}
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
                    value={formData.surfaceArea}
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
                    value={formData.produce}
                    onChange={handleChange}
                  ></Form.Control>
                </Form.Group>

                <Container className="d-flex justify-content-center mt-3">
                  <ReCAPTCHA
                    sitekey="6LdEMccqAAAAAHe-x4rL1qB2UKynRrM9e-5vZKnk"
                    onChange={(value) => setCaptchaValue(value)}
                  />
                </Container>

                {isLoading ? (
                  <Loader
                    testid="loader"
                    className="mt-3"
                    style={{ height: "40px", width: "40px" }}
                  />
                ) : (
                  <Container className="d-flex justify-content-center">
                    <BeeButton className="mt-4" type="submit">
                      {t("contactOurBees")}
                    </BeeButton>
                  </Container>
                )}
              </Form>
            </FormContainer>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PollinationContactPage;
