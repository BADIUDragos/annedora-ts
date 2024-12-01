import ProtectedRoute from "../../components/ProtectedRoute";
import { CartPage, ShippingPage } from "../../pages";

const cartRoutes = [
  {
    path: "cart",
    children: [
      {
        index: true,
        element: <CartPage />,
      },
      {
        path: "address",
        element: (
          <ProtectedRoute requiredPermissions={[]}>
            <ShippingPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default cartRoutes;
