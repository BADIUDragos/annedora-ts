import moment from "moment";
import { Button, Pagination, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { CreatedOrder } from "../store/interfaces/orderInterfaces";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaTimes } from "react-icons/fa";

interface OrderTableProps {
  filteredOrders: CreatedOrder[];
}

const OrderTable: React.FC<OrderTableProps> = ({ filteredOrders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const { t } = useTranslation("order");

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (currentPage > 1) {
      paginationItems.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} />
      );
      paginationItems.push(
        <Pagination.Prev
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
        />
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (Math.abs(currentPage - i) <= 2 || i === 1 || i === totalPages) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (currentPage < totalPages) {
      paginationItems.push(
        <Pagination.Next
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
        />
      );
      paginationItems.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />
      );
    }

    return paginationItems;
  };

  return (
    <>
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t("user")}</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>{t("shipped")}</th>
            <th>{t("delivered")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order: CreatedOrder) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user && order.user.first_name}</td>
              <td>{moment(order.paid_at).format("MMMM Do, YYYY")}</td>
              <td>${order.total_price}</td>
              <td>
                {order.is_shipped ? (
                  <FaCheck color="green"/>
                ) : (
                  <FaTimes color="red"/>
                )}
              </td>
              <td>
                {order.is_delivered ? (
                  <FaCheck color="green"/>
                ) : (
                  <FaTimes color="red"/>
                )}
              </td>
              <td>
                <LinkContainer to={`/order/${order.id}`}>
                  <Button variant="light" className="btn-sm">
                    DETAILS
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>{renderPaginationItems()}</Pagination>
    </>
  );
};

export default OrderTable;
