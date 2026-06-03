import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isSandbox = process.env.AUTH_SANDBOX === "true";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
        ]
      : []),
  ],
  pages: {
    signIn: "/en/signin",
    error: "/en/error",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});