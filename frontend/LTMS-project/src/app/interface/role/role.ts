export interface RoleDTO {
  id: number;
  name: string;
  permissions: Set<string> | string[]; // Depending on how you want to handle Sets in TS
}