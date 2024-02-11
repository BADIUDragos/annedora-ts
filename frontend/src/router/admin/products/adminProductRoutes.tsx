import ProtectedRoute from "../../../components/ProtectedRoute";
import { AdminCreateProductPage } from "../../../pages/Admin/Products/Create";
import { AdminEditProductPage } from "../../../pages/Admin/Products/View";
import { AdminProductsPage } from "../../../pages/Admin/Products/Table";

const adminProductRoutes = {
  path: "products",
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminProductsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "create",
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminCreateProductPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ":id",
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminEditProductPage />
        </ProtectedRoute>
      ),
    },
  ],
};

export default adminProductRoutes;
