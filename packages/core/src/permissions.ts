import type { UserRole } from "./types";

export const PERMISSION_ROLES = {
  tenantDashboard: ["owner", "instructor", "superadmin"] as UserRole[],
  manageSite: ["owner", "superadmin"] as UserRole[],
  viewFinance: ["owner", "superadmin"] as UserRole[],
  backoffice: ["superadmin"] as UserRole[],
  manageUsers: ["owner", "superadmin"] as UserRole[],
  viewStorage: ["owner", "superadmin"] as UserRole[],
};

export function canAccessTenantDashboard(role: UserRole): boolean {
  return PERMISSION_ROLES.tenantDashboard.includes(role);
}

export function canManageSite(role: UserRole): boolean {
  return PERMISSION_ROLES.manageSite.includes(role);
}

export function canViewFinance(role: UserRole): boolean {
  return PERMISSION_ROLES.viewFinance.includes(role);
}

export function canAccessBackoffice(role: UserRole): boolean {
  return PERMISSION_ROLES.backoffice.includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return PERMISSION_ROLES.manageUsers.includes(role);
}

export function canViewStorage(role: UserRole): boolean {
  return PERMISSION_ROLES.viewStorage.includes(role);
}
