import { Alert, Container } from "react-bootstrap";
import { useGetAllOrdersQuery } from "../../../store/apis/orderApi";
import Loader from "../../../components/Loader";
import getErrorString from "../../../store/errorHandling/getErrorString";
import OrderTable from "../../../components/OrderTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminOrdersPage = () => {
  const { data: orders, error, isLoading, isError } = useGetAllOrdersQuery();

  const { t } = useTranslation("order");

  return (
    <Container>
      <h2>{t("allOrders")}</h2>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert variant="danger">{getErrorString(error)}</Alert>
      ) : orders && orders.length > 0 ? (
        <OrderTable filteredOrders={orders} />
      ) : (
        <Alert variant="info">
          {t("noOrders")} <Link to="/products">{t("browseOurProducts")}</Link>
        </Alert>
      )}
    </Container>
  );
};

export default AdminOrdersPage;
