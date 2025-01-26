import {
  HomePage,
  LoginPage,
  Layout,
  ErrorPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  ChangePasswordPage,
} from "../pages";
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./admin/routes";
import ordersRoutes from "./order/routes";
import productRoutes from "./products/routes";
import pollinationContactRoutes from "./pollination/routes";
import cartRoutes from "./cart/routes";
import placeOrderRoutes from "./placeOrder/routes";

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      ...adminRoutes,
      ...ordersRoutes,
      ...productRoutes,
      ...pollinationContactRoutes,
      ...cartRoutes,
      ...placeOrderRoutes,
      { path: "/login", element: <LoginPage /> },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/resetpassword",
        element: <ResetPasswordPage />
      },
      {
        path: "/changepassword",
        element: <ChangePasswordPage />
      },
      { path: "*", element: <NotFoundPage /> },
    ],
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
