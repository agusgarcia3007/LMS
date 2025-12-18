export type UserRole = "superadmin" | "owner" | "instructor" | "student";

const ROLES = {
  tenantDashboard: ["owner", "instructor", "superadmin"] as UserRole[],
  manageSite: ["owner", "superadmin"] as UserRole[],
  viewFinance: ["owner", "superadmin"] as UserRole[],
  backoffice: ["superadmin"] as UserRole[],
  manageUsers: ["owner", "superadmin"] as UserRole[],
  viewStorage: ["owner", "superadmin"] as UserRole[],
};

export function canAccessTenantDashboard(role: UserRole): boolean {
  return ROLES.tenantDashboard.includes(role);
}

export function canManageSite(role: UserRole): boolean {
  return ROLES.manageSite.includes(role);
}

export function canViewFinance(role: UserRole): boolean {
  return ROLES.viewFinance.includes(role);
}

export function canAccessBackoffice(role: UserRole): boolean {
  return ROLES.backoffice.includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return ROLES.manageUsers.includes(role);
}

export function canViewStorage(role: UserRole): boolean {
  return ROLES.viewStorage.includes(role);
}
