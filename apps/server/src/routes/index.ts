import { authRoutes } from "./auth";
import { profileRoutes } from "./profile";
import { tenantsRoutes } from "./tenants";
import { usersRoutes } from "./users";

export const ROUTES = [
  { path: "/auth", name: "auth-routes", route: authRoutes },
  { path: "/profile", name: "profile-routes", route: profileRoutes },
  { path: "/tenants", name: "tenants-routes", route: tenantsRoutes },
  { path: "/users", name: "users-routes", route: usersRoutes },
];
