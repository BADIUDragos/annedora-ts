import { JwtPayload, jwtDecode } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  first_name: string;
  permissions: string[];
  email: string;
  isSuperuser: boolean;
  isStaff: boolean;
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const { id, first_name, permissions, email, isSuperuser, isStaff } = decoded;
    return { id, first_name, permissions, email, isSuperuser, isStaff };
  } catch (error) {
    return null;
  }
}
