import { Alert, Col, Container, Row, Form, Button } from "react-bootstrap";
import getErrorString from "../../../../store/errorHandling/getErrorString";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../store/apis/usersApi";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../components/Loader";
import FormContainer from "../../../../components/FormContainer";
import { FormEvent, useEffect, useState } from "react";

export const AdminViewUserPage = () => {

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>();
  const {
    data: user,
    isLoading: getUserLoading,
    error: getUserError,
    isSuccess: getUserSuccess,
  } = useGetUserByIdQuery(Number(id));

  const [
    updateUser,
    { isLoading: updateLoading, isSuccess: updateUserSuccess },
  ] = useUpdateUserMutation();

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isStaff, setIsStaff] = useState(false);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    await updateUser({ id: Number(id), data: { first_name: username, email: email, isStaff: isStaff } });
  };

  useEffect(() => {
    if (updateUserSuccess) {
      navigate('/admin/users')
    }

    if (getUserSuccess) {
      setName(user.first_name);
      setEmail(user.email);
      setIsStaff(user.isStaff);
    }
  }, [getUserSuccess, user]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Edit User Page</h1>
        </Col>
        <Col>{getUserLoading && <Loader />}</Col>
      </Row>
      <Row>
        {getUserError && (
          <Alert variant="danger">{getErrorString(getUserError)}</Alert>
        )}
      </Row>

      <FormContainer xs={12} md={6} className="justify-content-md-center">
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="mt-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="isAdmin" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isStaff}
              onChange={(e) => setIsStaff(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          {updateLoading ? (
            <Loader
              testid="loader"
              className="mt-4"
              style={{ height: "40px", width: "40px" }}
            />
          ) : (
            <Button
              type="submit"
              variant="primary"
              className="btn-block w-100 mt-4"
            >
              UPDATE
            </Button>
          )}
        </Form>
      </FormContainer>
    </Container>
  );
};
