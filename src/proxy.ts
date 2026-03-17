import { NextResponse, ProxyConfig, type NextRequest } from "next/server";

import { publicRoutes, REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE } from "@/config/public-routes";

import { appConfig } from "./config/app-config";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoute =
    publicRoutes.find((item) => pathname.startsWith(item.path)) || pathname === "/"
      ? {
          path: pathname,
          whenAuthenticated: "next",
        }
      : null;
  const authToken = request.cookies.get(appConfig.token)?.value;

  let response: NextResponse;

  if (!authToken && publicRoute) {
    response = NextResponse.next();
  } else if (!authToken && !publicRoute) {
    if (process.env.NEXT_PUBLIC_ONLY_ACCESS_APP === "TRUE") {
      return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url));
    } else {
      return NextResponse.redirect(
        new URL(
          `${process.env.NEXT_PUBLIC_SSO_URL}${REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE}?appId=${process.env.NEXT_PUBLIC_SSO_APP_ID}`,
          request.url,
        ),
      );
    }
  } else if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/spy";

    response = NextResponse.redirect(redirectUrl);
  } else {
    response = NextResponse.next();
  }

  return response;
}

export const config: ProxyConfig = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
