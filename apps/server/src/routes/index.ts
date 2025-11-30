import { authRoutes } from "./auth";
import { backofficeRoutes } from "./backoffice";
import { campusRoutes } from "./campus";
import { profileRoutes } from "./profile";
import { tenantsRoutes } from "./tenants";
import { usersRoutes } from "./users";

export const ROUTES = [
  { path: "/auth", name: "auth-routes", route: authRoutes },
  { path: "/backoffice", name: "backoffice-routes", route: backofficeRoutes },
  { path: "/campus", name: "campus-routes", route: campusRoutes },
  { path: "/profile", name: "profile-routes", route: profileRoutes },
  { path: "/tenants", name: "tenants-routes", route: tenantsRoutes },
  { path: "/users", name: "users-routes", route: usersRoutes },
];
