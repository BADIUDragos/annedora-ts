import { HomePage, LoginPage, Layout, ErrorPage, NotFoundPage } from "../pages"
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./admin/routes";
import profileRoutes from "./profile/routes";
import productRoutes from "./products/routes";
import pollinationContactRoutes from "./pollination/routes";
import cartRoutes from "./cart/routes";
import placeOrderRoutes from "./placeOrder/routes";

export const routes = [
  {
    element: <Layout/>,
    children: [
      { path: "/", element: <HomePage/> },
      ...adminRoutes,
      ...profileRoutes,
      ...productRoutes,
      ...pollinationContactRoutes,
      ...cartRoutes,
      ...placeOrderRoutes,
      { path: "/login", element: <LoginPage/> },
      { path: "*", element: <NotFoundPage/> }
    ],
    errorElement: <ErrorPage />,
  }
]

const router = createBrowserRouter(routes);

export default router;
