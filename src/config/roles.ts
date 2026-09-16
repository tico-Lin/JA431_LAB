import rolesData from '../../public/data/roles.json';

export type Role = string;

export const ROLES: Role[] = rolesData.roles;

// Maps SHA-256 hashes to their corresponding roles
export const ROLE_HASHES: Record<string, Role> = rolesData.roleHashes;

// Define page access permissions for each role
export const ROLE_PERMISSIONS: Record<Role, string[]> =
  rolesData.rolePermissions;

export const hasAccess = (role: Role, path: string): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(path) || false;
};
