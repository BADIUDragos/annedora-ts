import { useAuth } from "../store";
import isAuthorized, { IAuthorizationRequirements } from "./utils/isAuthorized";
import RequireAtLeastOne from "../interfaces/requireAtLeastOne";

export interface IProtectedComponent extends IAuthorizationRequirements {
  children: React.ReactNode;
}

type ProtectedComponentProps = RequireAtLeastOne<
  IProtectedComponent,
  "requiredPermissions" | "requiredStaff"
>;

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermissions = [],
  requiredStaff = false,
}) => {
  const { userInfo } = useAuth();

  return isAuthorized(userInfo, { requiredPermissions, requiredStaff }) ? (
    <>{children}</>
  ) : null;
};

export default ProtectedComponent;
