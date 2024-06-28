import ProfilePage from "../../pages/Profile/ProfilePage";
import RegisterPage from "../../pages/Profile/RegisterPage";

const profileRoutes = {
  path: "profile",
  children: [
    {
      index: true,
      element: (
        <ProfilePage/>
      ),
    },
    //   {
    //   path: ":id",
    //   element: (
    //     <ProtectedRoute>
    //       <></>
    //     </ProtectedRoute>
    //   ),
    // },
    {
      path: "register",
      element: (
        <RegisterPage/>
      ),
    },
  ],
};
export default profileRoutes;
