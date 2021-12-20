import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { apolloClient } from "../../../lib/apolloClient";
import { GET_USER_DETAILS } from "../../../graphql";

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Enter your name" },
        email: {
          label: "Username",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const {
          data: { users = [] },
        } = await apolloClient.query({
          query: GET_USER_DETAILS,
          variables: {
            where: {
              email: {
                _eq: credentials.email,
              },
            },
          },
        });
        if (users.length > 0) {
          const [user] = users;
          const matches = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (matches) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
          return null;
        }
      },
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
    // maxAge: 60 * 60 * 24, // 1 day
    encode: async ({ secret, token, maxAge }) => {
      const jwtClaims = {
        ...token,
        sub: token.sub,
        name: token.name,
        email: token.email,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + maxAge,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-role": "user",
          "x-hasura-user-id": token.id,
        },
      };
      return sign(jwtClaims, secret, { algorithm: "HS256" });
    },
    decode: async ({ secret, token }) => {
      return verify(token, secret, { algorithms: ["HS256"] });
    },
  },
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      return true;
    },
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      const ifUserSignedIn = user ? true : false;
      if (ifUserSignedIn) {
        token.id = user.id.toString();
        token.auth_time = Math.floor(Date.now() / 1000);
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      const encodedToken = sign(token, process.env.SECRET, {
        algorithm: "HS256",
      });
      session.id = token.id.toString();
      session.token = encodedToken;
      return Promise.resolve(session);
    },
  },
  debug: true,
});

// hashing
