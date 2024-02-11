import adminOrdersRoutes from "./orders/adminOrdersRoutes";
import adminProductRoutes from "./products/adminProductRoutes";
import adminUsersRoutes from "./users/adminUsersRoutes";

const adminRoutes = {
  path: "admin",
  children: [
    adminProductRoutes,
    adminUsersRoutes,
    adminOrdersRoutes
  ],
};
export default adminRoutes;
