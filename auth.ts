import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isSandbox = process.env.AUTH_SANDBOX === "true";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: isSandbox ? undefined : PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Sandbox WeChat provider (dev only)
    ...(isSandbox
      ? [
          CredentialsProvider({
            id: "wechat-sandbox",
            name: "WeChat (Sandbox)",
            credentials: {
              code: { label: "Code", type: "text" },
            },
            async authorize() {
              // Mock WeChat user for sandbox
              return {
                id: "wechat_sandbox_user",
                name: "WeChat Dev User",
                email: "wechat@sandbox.local",
                image: null,
              };
            },
          }),
        ]
      : []),
    // Sandbox Alipay provider (dev only)
    ...(isSandbox
      ? [
          CredentialsProvider({
            id: "alipay-sandbox",
            name: "Alipay (Sandbox)",
            credentials: {
              code: { label: "Code", type: "text" },
            },
            async authorize() {
              // Mock Alipay user for sandbox
              return {
                id: "alipay_sandbox_user",
                name: "Alipay Dev User",
                email: "alipay@sandbox.local",
                image: null,
              };
            },
          }),
          // Test credentials provider for E2E testing
          CredentialsProvider({
            id: "test-credentials",
            name: "Test User",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              // Only allow in test/sandbox mode
              if (!isSandbox) return null;
              // Accept test@test.com / password123 for E2E tests
              if (
                credentials?.email === "test@test.com" &&
                credentials?.password === "password123"
              ) {
                return {
                  id: "test_user_id",
                  name: "Test User",
                  email: "test@test.com",
                  image: null,
                };
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/en/signin",
    error: "/en/error",
  },
  session: {
    strategy: isSandbox ? "jwt" : "database",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        // For JWT sessions, use the token's sub; for database sessions, use user.id
        if (isSandbox && token?.sub) {
          session.user.id = token.sub;
        } else if (user?.id) {
          session.user.id = user.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});