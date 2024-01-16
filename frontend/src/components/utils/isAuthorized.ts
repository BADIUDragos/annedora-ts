import { UserInfoState } from "../../store/interfaces/authInterfaces";

export interface IAuthorizationRequirements {
  requiredPermissions?: string[];
  requiredStaff?: boolean;
}

const isAuthorized = (
  userInfo: UserInfoState | null, 
  { requiredPermissions = [], requiredStaff = false }: IAuthorizationRequirements
): boolean => {
  

  if (!userInfo) return false

  if (userInfo.isSuperuser) return true

  if (requiredStaff && !userInfo.isStaff) return false;

  return requiredPermissions.every(permission => userInfo.permissions?.includes(permission));

};

export default isAuthorized;
