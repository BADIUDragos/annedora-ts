import React, { useState, useEffect } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
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
import { addItemToCart } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { CartItem } from "../../store/interfaces/cartInterfaces";
import { useTranslation } from "react-i18next";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation("product");

  const {
    data: product,
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
    french_name: "",
    image: "",
    category: "",
    description: "",
    french_description: "",
    rating: 0,
    price: 0,
    count_in_stock: 0,
    num_reviews: 0,
    reviews: [],
    collects_tax: false,
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
    const cartItem: CartItem = {
      id: productData.id,
      name: productData.name,
      french_name: productData.french_name,
      image: productData.image,
      price: productData.price,
      count_in_stock: productData.count_in_stock,
      qty,
    };

    dispatch(addItemToCart(cartItem));

    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 3000);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProductReview({ id: Number(id), rating, comment });
  };

  return (
    <Container>
      <Link to="/products" className="btn btn-light my-3">
        {t("goToProducts")}
      </Link>

      <Row>
        <Col md={3}>
          <Image
            src={productData.image}
            alt={productData.name}
            fluid
            
          />
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>
              {i18n.language === "en" ? product?.name : product?.french_name}
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={productData.rating}
                text={`${productData.num_reviews} ${t("reviews")}`}
                color={"#f8e825"}
              />
            </ListGroup.Item>
            <ListGroup.Item>{t("price")}: ${productData.price}</ListGroup.Item>
            <ListGroup.Item>
              {t("description")}: {i18n.language === "en" ? product?.description : product?.french_description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>{t("price")}:</Col>
                  <Col>
                    <strong>${productData.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t("status")}:</Col>
                  <Col>
                    {productData.count_in_stock > 0
                      ? t("inStock")
                      : t("outOfStock")}
                  </Col>
                </Row>
              </ListGroup.Item>

              {productData.count_in_stock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>{t("quantity")}</Col>
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
                  {t("addToCart")}
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
              {t("itemHasBeenAdded")}
            </Alert>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4 className="mt-5">{t("reviews")}</h4>
              {productData.num_reviews === 0 && (
                <Alert variant="info">{t("noReviewsYet")}</Alert>
              )}
            </ListGroup.Item>

            {productData.num_reviews !== 0 &&
              productData.reviews.map((review) => (
                <ListGroup.Item key={review.id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color="#f8ea25" text={""} />
                  <p>{moment(review.created_at).format("MMMM Do, YYYY")}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}

            <ListGroup.Item>
              <h4 className="mt-5">{t("addReview")}</h4>
              {loadingProductReview && <Loader />}
              {successProductReview && (
                <Alert variant="success">{t("reviewAdded")}</Alert>
              )}
              {errorProductReview && (
                <Alert variant="danger">
                  {getErrorString(errorProductReview)}
                </Alert>
              )}

              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>{t("rating")}</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="">{t("select")}</option>
                      <option value="1">{t("poor")}</option>
                      <option value="2">{t("fair")}</option>
                      <option value="3">{t("good")}</option>
                      <option value="4">{t("vGood")}</option>
                      <option value="5">{t("excellent")}</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment">
                    <Form.Label className="mt-2">{t("review")}</Form.Label>
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
                    {t("submit")}
                  </Button>
                </Form>
              ) : (
                <Alert variant="info">
                  {t("please")} <NavLink to="/login">{t("login")}</NavLink> {t("toWrite")}
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
