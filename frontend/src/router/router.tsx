import { HomePage, LoginPage, Layout, ErrorPage, NotFoundPage, CartPage, ProductsPage } from "../pages"
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./admin/routes";
import profileRoutes from "./profile/routes";

export const routes = [
  {
    element: <Layout/>,
    children: [
      { path: "/", element: <HomePage/> },
      ...adminRoutes,
      ...profileRoutes,
      { path: "/products", element: <ProductsPage/>},
      { path: "/cart", element: <CartPage/>},
      { path: "/login", element: <LoginPage/> },
      { path: "*", element: <NotFoundPage/> }
    ],
    errorElement: <ErrorPage />,
  }
]

const router = createBrowserRouter(routes);

export default router;
