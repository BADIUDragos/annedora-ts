import ProtectedRoute from "../../components/ProtectedRoute";
import { MyOrdersPage, RegisterPage } from "../../pages";

const profileRoutes = [
  {
    path: ":id",
    element: (
      <ProtectedRoute requiredPermissions={[]}>
        <MyOrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
];

export default profileRoutes;
