export interface RegisterRequest {
  firstName: string;
  lastName: string;
  loginName?: string;
  email: string;
  password: string;
  roleId: number;
  orgId?: number;
}