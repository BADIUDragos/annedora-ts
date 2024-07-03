import { ProductsPage } from "../../pages";

const adminProductRoutes = {
    path: "products",
    children: [
      {
        index: true,
        element: <ProductsPage/>,
      },
    //   {
    //     path: ":id",
    //     element: (
    //       <ProtectedRoute requiredStaff={true}>
    //         <AdminEditProductPage />
    //       </ProtectedRoute>
    //     ),
    //   },
    ],
  };
  
  export default adminProductRoutes;