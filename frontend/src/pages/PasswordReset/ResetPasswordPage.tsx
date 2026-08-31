import { useState } from "react";
import FormContainer from "../../components/FormContainer";
import { Form, Alert, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useResetPasswordMutation } from "../../store/apis/authApi";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
  const { t } = useTranslation("register");

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [resetPasswordRequest, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetPasswordRequest({ email: email });
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>{t("resetPassword")}</h1>

      {!submitted && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>{t("enterEmail")}</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder={t("enterEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-3 mb-3">
          {t("resetPassword")}
          </Button>
        </Form>
      )}

      {submitted && (
        <Alert variant="success">
          {t("checkYourEmail")}
        </Alert>
      )}
      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default ResetPasswordPage;
