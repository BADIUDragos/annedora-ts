import { HomePage, LoginPage, Layout, ErrorPage, NotFoundPage, CartPage, ProductsPage } from "../pages"
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./admin/routes";
import profileRoutes from "./profile/routes";
import productRoutes from "./products/routes";
import pollinationContactRoutes from "./pollination/routes";

export const routes = [
  {
    element: <Layout/>,
    children: [
      { path: "/", element: <HomePage/> },
      ...adminRoutes,
      ...profileRoutes,
      ...productRoutes,
      ...pollinationContactRoutes,
      { path: "/cart", element: <CartPage/>},
      { path: "/login", element: <LoginPage/> },
      { path: "*", element: <NotFoundPage/> }
    ],
    errorElement: <ErrorPage />,
  }
]

const router = createBrowserRouter(routes);

export default router;
