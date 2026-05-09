import {  RoleDTO } from "../role/role";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isVerified?: boolean;
    orgUnit?: string;
    loginName: string;
    roles: RoleDTO[];
  }