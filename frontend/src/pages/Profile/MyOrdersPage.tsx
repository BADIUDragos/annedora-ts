import { Alert, Col, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../store/apis/orderApi";
import getErrorString from "../../store/errorHandling/getErrorString";
import OrderTable from "../../components/OrderTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyOrdersPage: React.FC = () => {
  const { data: orders, error, isLoading, isError } = useGetMyOrdersQuery();

  const { t } = useTranslation("order");

  return (
    <Container>
      <Col>
        <h2>{t("myOrders")}</h2>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Alert variant="danger">{getErrorString(error)}</Alert>
        ) : orders && orders.length > 0 ? (
          <OrderTable filteredOrders={orders} />
        ) : (
          <Alert variant="info">
            {t("noOrders")}{" "}
            <Link to="/products">{t("browseOurProducts")}</Link>
          </Alert>
        )}
      </Col>
    </Container>
  );
};

export default MyOrdersPage;
