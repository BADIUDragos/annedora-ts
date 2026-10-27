import ProtectedRoute from "../../../components/ProtectedRoute";
import { AdminTableUsersPage } from "../../../pages/Admin/Users/Table";
import { AdminViewUserPage } from "../../../pages/Admin/Users/View";

const adminUsersRoutes = {
  path: "users",
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminTableUsersPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ":id",
      element: (
        <ProtectedRoute requiredStaff={true}>
          <AdminViewUserPage />
        </ProtectedRoute>
      ),
    },
  ],
};

export default adminUsersRoutes;
