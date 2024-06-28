import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { useRegisterMutation } from "../../store/apis/authApi";
import Loader from "../../components/Loader";
import getErrorString from "../../store/errorHandling/getErrorString";
import { useAuth } from "../../store";

const RegisterPage: React.FC = () => {

  const navigate = useNavigate();

  const {userInfo} = useAuth()

  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    } else {
      setMessage("");
      await register({
        username: formState.name,
        email: formState.email,
        password: formState.password,
      });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>Register</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            placeholder="John Doe"
            value={formState.name}
            onChange={handleChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type="email"
            name="email"
            placeholder="john@doe.com"
            value={formState.email}
            onChange={handleChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            name="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formState.confirmPassword}
            onChange={handleChange}
          ></Form.Control>
        </Form.Group>

        {isLoading ? (
          <Loader
            testid="loader"
            className="mt-3"
            style={{ height: "40px", width: "40px" }}
          />
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="btn-block w-100 mt-4"
          >
            Register
          </Button>
        )}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to={"/login"}>Sign In</Link>
        </Col>
      </Row>

      {message && <Alert variant="danger">{message}</Alert>}
      {error && (
        <Row className="mt-3">
          <Alert variant="danger">
            {getErrorString(error).toString()}
          </Alert>
        </Row>
      )}
    </FormContainer>
  );
};

export default RegisterPage;
