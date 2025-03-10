import { useState } from "react";
import { useLocation } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import { Alert, Button, Form } from "react-bootstrap";
import Loader from "../../components/Loader";
import {
  useUpdatePasswordMutation,
  useValidateTokenQuery,
} from "../../store/apis/authApi";
import { UpdatePasswordInterface } from "../../store/interfaces/authInterfaces";
import getErrorString from "../../store/errorHandling/getErrorString";
import { useTranslation } from "react-i18next";

const ChangePasswordScreen = () => {

  const { t } = useTranslation("register")

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const validateTokenParameters = { uid, token };

  const {
    isLoading: validateLoading,
    error: validateError,
    isSuccess: validateSuccess,
  } = useValidateTokenQuery(validateTokenParameters);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordData: UpdatePasswordInterface = {
    password: password,
    uid: uid,
    token: token,
  };

  const [message, setMessage] = useState("");

  const [
    updatePassword,
    { isSuccess: updateSuccess, error: updateError, isLoading: updateLoading },
  ] = useUpdatePasswordMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else if (validateSuccess) {
      try {
        await updatePassword(passwordData).unwrap();
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
  };

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>changePassword</h1>

      {validateLoading && <Loader />}

      {!updateLoading && !validateError && !validateLoading && !updateSuccess && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="password">
            <Form.Label>{t("newPassword")}:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder={t("enterPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirm-password" className="mt-3">
            <Form.Label>{t("confirmPassword")}:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="btn-block w-100 mt-3 mb-3"
          >
            {t("changePassword")}
          </Button>

          {message && <Alert variant="danger">{message}</Alert>}

        </Form>
      )}

      {updateError && (
        <Alert variant="danger">{getErrorString(updateError)}</Alert>
      )}
      {validateError && (
        <Alert variant="danger">{getErrorString(validateError)}</Alert>
      )}
      {updateError && (
        <Alert variant="danger">{getErrorString(updateError)}</Alert>
      )}
      {updateSuccess && (
        <Alert variant="success">{t("changeSuccess")}</Alert>
      )}
      {updateLoading && <Loader />}
    </FormContainer>
  );
};

export default ChangePasswordScreen;
