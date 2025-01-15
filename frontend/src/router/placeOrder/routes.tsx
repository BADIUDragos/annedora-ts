import { PlaceOrderPage } from "../../pages";

const placeOrderRoutes = [
  {
    path: "placeorder",
    children: [
      {
        index: true,
        element: <PlaceOrderPage />,
      }
    ],
  },
];

export default placeOrderRoutes;