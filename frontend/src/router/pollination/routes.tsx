import { PollinationContactPage } from "../../pages";

const pollinationContactRoutes = [
  {
    path: "pollinationcontact",
    children: [
      {
        index: true,
        element: <PollinationContactPage />,
      }
    ],
  },
];

export default pollinationContactRoutes;