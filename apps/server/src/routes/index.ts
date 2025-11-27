import { authRoutes } from "./auth";
import { profileRoutes } from "./profile";
import { tenantsRoutes } from "./tenants";

export const ROUTES = [
  { path: "/auth", name: "auth-routes", route: authRoutes },
  { path: "/profile", name: "profile-routes", route: profileRoutes },
  { path: "/tenants", name: "tenants-routes", route: tenantsRoutes },
];
