import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

import { useLoginMutation, useAuth } from "../store";
import Loader from "../components/Loader";
import { NavLink, useNavigate } from "react-router-dom";
import getErrorString from "../store/errorHandling/getErrorString";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {

  const { t } = useTranslation("home")

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userInfo } = useAuth();

  const [triggerLogin, { isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerLogin({ username, password });
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>{t('signIn')}</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="username">
          <Form.Label>{t('email')}</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder={t('emailPlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="mt-3">
          <Form.Label>{t('password')}</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading ? (
          <Loader testid="loader" className="mt-3" style={{ height: "40px", width: "40px" }} />
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="btn-block w-100 mt-3"
          >
            {t('signIn')}
          </Button>
        )}
      </Form>

      <Row className="py-3">
        <Col>
        {t('newCustomer')}?{" "}
          <NavLink to={"/register"}>
          {t('register')}
          </NavLink>
        </Col>
        <Col>
        {t('forgotPassword')}?{" "}
          <NavLink to={`/resetpassword`}>
          {t('resetPassword')}
          </NavLink>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {getErrorString(error)}
        </Alert>
      )}
    </FormContainer>
  );
};

export default LoginPage;
