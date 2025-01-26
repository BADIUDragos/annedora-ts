import { useState } from "react";
import FormContainer from "../../components/FormContainer";
import { Form, Alert, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useResetPasswordMutation } from "../../store/apis/authApi";
import getErrorString from "../../store/errorHandling/getErrorString";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [ resetPasswordRequest, { isSuccess, error, isLoading }] = useResetPasswordMutation()

  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetPasswordRequest({"email":email});
    } catch (error:any) {
      console.error("Failed to reset password:", getErrorString(error));
    }
  };

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>Reset Password</h1>

      {!isSuccess && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Please enter your email address:</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-3 mb-3">
            Reset Password
          </Button>
        </Form>
      )}

      {error && <Alert variant="danger">{getErrorString(error)}</Alert>}
      {isSuccess && (
        <Alert variant="success">
          Please check your email to reset your password.
        </Alert>
      )}
      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default ResetPasswordPage;
