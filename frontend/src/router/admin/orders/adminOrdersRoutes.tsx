import ProtectedRoute from "../../../components/ProtectedRoute";
import AdminOrdersPage from "../../../pages/Admin/Orders";


const adminOrdersRoutes = {
  path: "orders",
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminOrdersPage />
        </ProtectedRoute>
      ),
    },
  ],
};

export default adminOrdersRoutes;
