import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "dummy-facebook-client-id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "dummy-facebook-client-secret",
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async session({ session, token, user }) {
      return session; // Send properties to the client
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "nurvera-dummy-secret-key-for-dev",
};

export default NextAuth(authOptions);
