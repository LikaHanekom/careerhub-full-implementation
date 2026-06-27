import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const users = [
  { id: "2d5d8e24-9b16-4d2a-89a1-fbf22d4f5c92", username: "employer1", password: "password123", role: "employer", name: "FinanceFlow" },
  { id: "75ba7d3e-2b50-4841-860e-cbfb4e54e4df", username: "employer2", password: "password123", role: "employer", name: "TechCorp" },
  { id: "a1111111-1111-1111-1111-111111111111", username: "alice", password: "password123", role: "candidate", name: "Applicant A" },
  { id: "b2222222-2222-2222-2222-222222222222", username: "bob",   password: "password123", role: "candidate", name: "Applicant B" },
];

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password
        );
        if (!user) return null;
        return { id: user.id, name: user.name, role: user.role, username: user.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };

// v4 helper exports to match v5-style imports used elsewhere
export { getServerSession as auth } from "next-auth";
// signIn/signOut are client-side in v4 — export the config for server use
export { authConfig as config };