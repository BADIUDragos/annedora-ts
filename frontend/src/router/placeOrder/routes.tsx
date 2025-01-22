import ProtectedRoute from "../../components/ProtectedRoute";
import { PlaceOrderPage } from "../../pages";

const placeOrderRoutes = [
  {
    path: "placeorder",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredPermissions={[]}>
            <PlaceOrderPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
];

export default placeOrderRoutes;