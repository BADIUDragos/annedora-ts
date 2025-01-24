import React from "react";
import { CreatedOrder } from "../../store/interfaces/orderInterfaces";
import { useTranslation } from "react-i18next";
import { Alert } from "react-bootstrap";
import moment from "moment";

const OrderInfo: React.FC<CreatedOrder> = (order) => {
  
  const { t } = useTranslation("order")
  
  return (
    <>
      <h2>{t("address")}</h2>
      <p>
        <strong>{t("name")}: </strong> {order.user.first_name}{" "}
      </p>
      <p>
        <strong>Email: </strong> {order.user.email}{" "}
      </p>
      <p>
        <strong>{t("address")}:</strong> {order.shipping_address.address},{" "}
        {order.shipping_address.city},{"   "}
        {order.shipping_address.postalCode},{"   "}
        {"Canada"}
      </p>
      {order.is_paid ? (
        <Alert variant="success">
          {t("paidOn")} {moment(order.paid_at).format("DD/MM/YYYY")}
        </Alert>
      ) : (
        <Alert variant="warning">{t("notPaid")}</Alert>
      )}
    </>
  );
};

export default OrderInfo;
