import { Alert } from "react-bootstrap";
import { CreatedOrder } from "../../store/interfaces/orderInterfaces";
import moment from "moment";
import { useTranslation } from "react-i18next";

const OrderStatus: React.FC<CreatedOrder> = (order) => {
  const { order_option } = order;

  const { t } = useTranslation("order");

  if (order_option === "Shipping") {
    return (
      <>
        {order.is_shipped ? (
          <Alert variant="success">
            {t("sentOn")} {moment(order.shipped_date).format("DD/MM/YYYY")}
          </Alert>
        ) : (
          <Alert variant="warning">{t("notSent")}</Alert>
        )}
        {order.is_delivered ? (
          <Alert variant="success">
            {t("deliveredOn")}{" "}
            {moment(order.delivered_at).format("DD/MM/YYYY")}
          </Alert>
        ) : (
          <Alert variant="warning">{t("notDelivered")}</Alert>
        )}
      </>
    );
  }

  return (
    <>
      {order.is_delivered ? (
        <Alert variant="success">
          {t("pickedUpOn")}{" "}
          {moment(order.delivered_at).format("DD/MM/YYYY")}
        </Alert>
      ) : (
        <Alert variant="warning">{t("notYetPickedUp")}</Alert>
      )}
    </>
  );
};

export default OrderStatus;
