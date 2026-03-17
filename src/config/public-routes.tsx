export const publicRoutes = [
  { path: "/auth/sign-in", whenAuthenticated: "redirect" },
  { path: "/auth/login-sso", whenAuthenticated: "redirect" },
  { path: "/auth/forgot-password", whenAuthenticated: "redirect" },
  { path: "/auth/recover-password", whenAuthenticated: "redirect" },
  { path: "/auth/magic-link", whenAuthenticated: "redirect" },
] as const;

export const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/auth/sign-in";
export const REDIRECT_SIGN_OUT_ROUTE = "/auth/sign-in";
