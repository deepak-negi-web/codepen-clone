import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { apolloClient } from "../../../lib/apolloClient";
import {
  GET_USER_DETAILS,
  GET_AUTH_PROVIDER_DETAILS,
  CREATE_AUTH_PROVIDER_USER,
} from "../../../graphql";

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
          throw new Error(
            "Email or password is incorrect! Please check and try again."
          );
        } else {
          throw new Error(
            "Looks like you don't have an account yet! Sign up instead!"
          );
        }
      },
    }),
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
      try {
        const {
          data: { users_authProvider = [] },
        } = await apolloClient.query({
          query: GET_AUTH_PROVIDER_DETAILS,
          variables: {
            where: {
              providerAccountId: { _eq: user.id },
            },
          },
        });
        if (users_authProvider.length > 0) {
          return true;
        }
        let customer = {};
        if (account.type === "oauth") {
          customer.name = user.name;
          customer.email = user.email;
          customer.avatar = user.image;
        }
        await apolloClient.mutate({
          mutation: CREATE_AUTH_PROVIDER_USER,
          variables: {
            object: {
              providerType: account.type,
              providerAccountId: user.id || null,
              provider: account.provider || account.id || "credentials",
              ...(account.type === "credentials" && {
                userId: user.id,
              }),
              ...(Object.keys(customer).length > 0 && {
                user: {
                  data: customer,
                  on_conflict: {
                    update_columns: [],
                    constraint: "users_email_key",
                  },
                },
              }),
            },
          },
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      const ifUserSignedIn = user ? true : false;
      if (ifUserSignedIn) {
        token.id = user.id;
        token.auth_time = Math.floor(Date.now() / 1000);
        token.accountType = account.type;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      const encodedToken = sign(token, process.env.SECRET, {
        algorithm: "HS256",
      });
      const { sub: id, accountType } = token;

      const {
        data: { users_authProvider = [] },
      } = await apolloClient.query({
        query: GET_AUTH_PROVIDER_DETAILS,
        variables: {
          where: {
            ...(accountType === "credentials" && {
              userId: { _eq: id },
            }),
            ...(accountType === "oauth" && {
              providerAccountId: { _eq: id },
            }),
          },
        },
      });
      if (users_authProvider.length > 0) {
        const [authUser] = users_authProvider;
        session.id = token.id;
        session.user.email = authUser.user.email;
        session.user.id = authUser.userId;
        session.user.name = authUser.user.name;
        session.token = encodedToken;
      }
      return Promise.resolve(session);
    },
  },
  debug: true,
});

// hashing
