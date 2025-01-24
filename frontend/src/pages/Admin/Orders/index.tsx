import { Alert, Container, FormControl, Tab, Tabs } from "react-bootstrap";
import { useGetAllOrdersQuery } from "../../../store/apis/orderApi";
import Loader from "../../../components/Loader";
import getErrorString from "../../../store/errorHandling/getErrorString";
import OrderTable from "../../../components/OrderTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CreatedOrder } from "../../../store/interfaces/orderInterfaces";

const AdminOrdersPage = () => {
  const { data: orders, error, isLoading, isError } = useGetAllOrdersQuery();

  const { t } = useTranslation("order");

  const [search, setSearch] = useState("");

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Alert variant="danger">{getErrorString(error)}</Alert>;
  }

  if (!orders) {
    return (
      <Alert variant="info">
        {t("noOrders")} <Link to="/products">{t("browseOurProducts")}</Link>
      </Alert>
    );
  }

  const filteredOrders = (orders: CreatedOrder[]) => {
    return orders.filter((order) =>
      order.user && order.user.first_name
        ? order.user.first_name.toLowerCase().includes(search.toLowerCase())
        : false
    );
  };

  return (
    <Container>
      <h2>{t("allOrders")}</h2>
      <FormControl
        className="mb-3"
        type="text"
        placeholder="Search by User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Tabs defaultActiveKey="toShip" id="orders-tabs">
        <Tab eventKey="toShip" title="New Orders">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
                .filter((order) => !order.is_shipped)
                .sort(
                  (a, b) =>
                    new Date(a.paid_at as string).getTime() -
                    new Date(b.paid_at as string).getTime()
                )
            )}
          />
        </Tab>
        <Tab eventKey="toDeliver" title="Shipped">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
                .filter((order) => order.is_shipped && !order.is_delivered)
                .sort(
                  (a, b) =>
                    new Date(b.paid_at as string).getTime() -
                    new Date(a.paid_at as string).getTime()
                )
            )}
          />
        </Tab>
        <Tab eventKey="delivered" title="Fulfilled">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
                .filter((order) => order.is_shipped && order.is_delivered)
                .sort(
                  (a, b) =>
                    new Date(b.paid_at as string).getTime() -
                    new Date(a.paid_at as string).getTime()
                )
            )}
          />
        </Tab>
        <Tab eventKey="allOrders" title="All Orders">
          <OrderTable
            filteredOrders={[...(orders ?? [])].sort(
              (a, b) =>
                new Date(b.paid_at as string).getTime() -
                new Date(a.paid_at as string).getTime()
            )}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminOrdersPage;
