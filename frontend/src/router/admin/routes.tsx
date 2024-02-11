import adminOrdersRoutes from "./orders/adminOrdersRoutes";
import adminProductRoutes from "./products/adminProductRoutes";
import adminUsersRoutes from "./users/adminUsersRoutes";

const adminRoutes = {
  path: "admin",
  children: [
    adminProductRoutes,
    adminUsersRoutes,
    adminOrdersRoutes
    // { path: "users", element: <AdminUsersPage/> },
    // { path: "orders", element: <AdminOrdersPage/> }
  ],
};
export default adminRoutes;
