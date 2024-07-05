import { ProductPage, ProductsPage } from "../../pages";

const productRoutes = [
  {
    path: "products",
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: ":id",
        element: <ProductPage />,
      },
    ],
  },
];

export default productRoutes;