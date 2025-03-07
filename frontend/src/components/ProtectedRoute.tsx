import { Navigate } from "react-router-dom";
import { useAuth } from "../store";
import isAuthorized from "./utils/isAuthorized";
import RequireAtLeastOne from "../interfaces/requireAtLeastOne";
import { IProtectedComponent } from "./ProtectedComponent";

export interface IProtectedRoute extends IProtectedComponent {
  redirectUrl?: string;
}

type ProtectedRouteProps = RequireAtLeastOne<
  IProtectedRoute,
  "requiredPermissions" | "requiredStaff"
>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectUrl = "/login",
  requiredPermissions = [],
  requiredStaff = false,
}) => {
  const { userInfo } = useAuth();

  return isAuthorized(userInfo, { requiredPermissions, requiredStaff }) ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectUrl} />
  );
};

export default ProtectedRoute;
