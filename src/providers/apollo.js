import { useMemo } from "react";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

let apolloClient, token;

const createApolloClient = () => {
  const authLink = setContext((_, { headers }) => {
    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    let promise = new Promise((resolve, reject) => {
      fetch("/api/auth/session").then((response) => {
        const session = response.json().then((parsedToken) => {
          token = parsedToken.token;
          const auth = token ? { Authorization: `Bearer ${token}` } : {};
          resolve({
            headers: {
              ...headers,
              ...auth,
            },
          });
        });
      });
    });
    return promise;
  });

  // const wsLink = setContext((_, { headers }) => {
  //   if (process.browser) {
  //     if (token) {
  //       return new WebSocketLink({
  //         uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_SUBSCRIPTION_URI,
  //         options: {
  //           reconnect: true,
  //           connectionParams: {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           },
  //         },
  //       });
  //     }

  //     let promise = new Promise((resolve, reject) => {
  //       fetch("/api/auth/session").then((response) => {
  //         const session = response.json().then((parsedToken) => {
  //           token = parsedToken.token;
  //           const auth = token ? { Authorization: `Bearer ${token}` } : {};
  //           console.log("auth-sub", auth);
  //           resolve(
  //             new WebSocketLink({
  //               uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_SUBSCRIPTION_URI,
  //               options: {
  //                 reconnect: true,
  //                 connectionParams: {
  //                   headers: {
  //                     ...auth,
  //                   },
  //                 },
  //               },
  //             })
  //           );
  //         });
  //       });
  //     });
  //     return promise;
  //   }
  //   return null;
  // });

  // const wsLink = process.browser
  //   ? new WebSocketLink({
  //       uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_SUBSCRIPTION_URI,
  //       options: {
  //         reconnect: true,
  //         connectionParams: {
  //           headers: {
  //             "x-hasura-admin-secret":
  //               process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
  //           },
  //         },
  //       },
  //     })
  //   : null;

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URI,
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
