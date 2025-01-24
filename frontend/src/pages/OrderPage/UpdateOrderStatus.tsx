import { Button, ListGroup } from "react-bootstrap";
import {
  useMarkOrderAsDeliveredMutation,
  useMarkOrderAsShippedMutation,
} from "../../store/apis/orderApi";
import { CreatedOrder } from "../../store/interfaces/orderInterfaces";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

const UpdateOrderStatus: React.FC<CreatedOrder> = (order) => {

  const { t } = useTranslation("order")

  const [markOrderAsShipped, { isLoading: isShippingLoading }] =
    useMarkOrderAsShippedMutation();
  const [markOrderAsDelivered, { isLoading: isDeliveryLoading }] =
    useMarkOrderAsDeliveredMutation();

  const markAsShippedHandler = async () => {
    if (order && window.confirm("Are you sure you shipped this product ?")) {
      await markOrderAsShipped(order.id);
    }
  };

  const markAsDeliveredHandler = async () => {
    if (order && window.confirm("Are you sure this product was delivered ?")) {
      await markOrderAsDelivered(order.id);
    }
  };

  return (
    <>
      <ListGroup>
        {!order.is_shipped && order.order_option === "Shipping" && (
          <ListGroup.Item>
            {isShippingLoading ? (
              <Loader
                style={{ height: "40px", width: "40px" }}
                className="mt-3"
              />
            ) : (
              <Button
                type="button"
                className="btn btn-block w-100 mt-3"
                onClick={markAsShippedHandler}
                disabled={order.is_shipped}
              >
                {t("markShipped")}
              </Button>
            )}
          </ListGroup.Item>
        )}
        {!order.is_delivered && (
          <ListGroup.Item>
            {isDeliveryLoading ? (
              <Loader
                style={{ height: "40px", width: "40px" }}
                className="mt-3"
              />
            ) : (
              <Button
                type="button"
                className="btn btn-block w-100 mt-3"
                onClick={markAsDeliveredHandler}
              >
                {t("markFulfilled")}
              </Button>
            )}
          </ListGroup.Item>
        )}
      </ListGroup>
    </>
  );
};

export default UpdateOrderStatus;
