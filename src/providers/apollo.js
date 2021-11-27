import {
  ApolloClient,
  ApolloProvider as DataProvider,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";

export const ApolloProvider = ({ children }) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      },
    };
  });

  const wsLink = process.browser
    ? new WebSocketLink({
        uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_SUBSCRIPTION_URI,
        options: {
          reconnect: true,
          connectionParams: {
            headers: {
              "x-hasura-admin-secret":
                process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
            },
          },
        },
      })
    : null;

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URI,
  });

  const link = process.browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    : httpLink;

  const client = new ApolloClient({
    link,
    fetch,
    cache: new InMemoryCache(),
  });
  return <DataProvider client={client}>{children}</DataProvider>;
};
