import ProtectedRoute from "../../components/ProtectedRoute";
import { MyOrdersPage, OrderPage } from "../../pages";

const ordersRoutes = [
  {
    path: "orders",
    element: (
      <ProtectedRoute requiredPermissions={[]}>
        <MyOrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "orders/:id",
    element: (
      <ProtectedRoute requiredPermissions={[]}>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
  
];

export default ordersRoutes;
