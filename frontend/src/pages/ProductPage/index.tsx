import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Alert,
  Container,
} from "react-bootstrap";
import moment from "moment";
import {
  useGetProductByIdQuery,
  useCreateProductReviewMutation,
} from "../../store/apis/productApi";
import Rating from "../../components/Rating";
import Loader from "../../components/Loader";
import { useAuth } from "../../store";
import { ProductState } from "../../store/interfaces/productInterfaces";
import getErrorString from "../../store/errorHandling/getErrorString";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);

  const {
    data: product,
    error,
    isLoading,
    isSuccess,
  } = useGetProductByIdQuery(Number(id));
  const [
    createProductReview,
    {
      isLoading: loadingProductReview,
      error: errorProductReview,
      isSuccess: successProductReview,
    },
  ] = useCreateProductReviewMutation();

  const { userInfo } = useAuth();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [productData, setProductData] = useState<ProductState>({
    id: 0,
    name: "",
    image: "",
    category: "",
    description: "",
    rating: 0,
    price: 0,
    count_in_stock: 0,
    num_reviews: 0,
    reviews: [],
  });

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }

    if (product) {
      setProductData(product);
    }
  }, [successProductReview, product, isSuccess]);

  const addToCartHandler = () => {
    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 3000);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProductReview({ id: Number(id), rating, comment });
  };

  return (
    <Container>
      <NavLink to="/products" className="btn btn-light my-3">
        Go Back
      </NavLink>

      <Row>
        <Col md={6}>
          <Image src={productData.image} alt={productData.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{productData.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={productData.rating}
                text={`${productData.num_reviews} reviews`}
                color={"#f8e825"}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${productData.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: {productData.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${productData.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {productData.count_in_stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {productData.count_in_stock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col xs="auto" className="my-1">
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(productData.count_in_stock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="btn-block w-100"
                  disabled={productData.count_in_stock === 0}
                  type="button"
                  style={{ marginBottom: "0.5rem" }}
                >
                  ADD TO CART
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          {showAddToCartSuccess ? (
            <Alert
              variant="success"
              className="mt-3"
              style={{ textAlign: "center" }}
            >
              Items added to cart!
            </Alert>
          ) : null}
        </Col>
      </Row>
      <Row>
      <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="mt-5">Reviews</h4>
                  {productData.num_reviews === 0 && (
                    <Alert variant="info">No reviews yet, be our first!</Alert>
                  )}
                </ListGroup.Item>

                {productData.num_reviews !== 0 && productData.reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <strong>{review.user}</strong>
                    <Rating value={review.rating} color="#f8ea25" text={""} />
                    <p>{moment(review.created_at).format("MMMM Do, YYYY")}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4 className="mt-5">Add a review</h4>
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Alert variant="success">Review submitted!</Alert>
                  )}
                  {errorProductReview && (
                    <Alert variant="danger">{getErrorString(errorProductReview)}</Alert>
                  )}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label className="mt-2">Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                        className="mt-3"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Alert variant="info">
                      Please <NavLink to="/login">login</NavLink> to write a review
                    </Alert>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
