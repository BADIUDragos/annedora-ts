import ProfilePage from "../../pages/Profile/ProfilePage";
import RegisterPage from "../../pages/Profile/RegisterPage";

const profileRoutes = [
  {
      path: ":id",
      element: <ProfilePage />,
  },
  {
      path: "register",
      element: <RegisterPage />,
  },
];

export default profileRoutes;
