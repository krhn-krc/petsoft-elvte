import { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./server-utils";

export const nextAuthEdgeConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      // Guard clause for unauthorized access
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      // Redirect to payment page if user is logged in but doesn't have access
      if (isLoggedIn && isTryingToAccessApp && !auth.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      // Allow access if user is logged in and has access
      if (isLoggedIn && isTryingToAccessApp && auth.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAccessApp && !auth.user.hasAccess) {
        if (
          // User is on login or signup and doesn't have access
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }
        return true;
      }

      // Allowance for public routes
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },

    jwt: async ({ token, user, trigger }) => {
      // runs when token is created
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on every request/ session update
        const userFromDb = await getUserByEmail(token.email);
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },

    session: ({ session, token }) => {
      // this will be exposed to the client!
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
