import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// Mock users data
const users = [
  { id: "1", username: "employer1", password: "password123", role: "employer", name: "Employer One" },
  { id: "2", username: "employer2", password: "password123", role: "employer", name: "Employer Two" },
  { id: "3", username: "alice", password: "password123", role: "candidate", name: "Alice" },
  { id: "4", username: "bob", password: "password123", role: "candidate", name: "Bob" },
];

export const authConfig = {
  providers: [
    Credentials({
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
        
        return {
          id: user.id,
          name: user.name,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
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
      if (token) {
        session.user.role = token.role ?? "";
        session.user.id = token.id ?? "";
        session.user.username = token.username ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);