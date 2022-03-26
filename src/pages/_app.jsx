import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "react-hot-toast";

import { Header, Footer, ModalManager } from "../components";
import { ModalProvider, useApollo, EditorConfigProvider } from "../providers";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <Toaster />
        <ModalProvider>
          <EditorConfigProvider>
            <GlobalStyles />
            <ModalManager />
            <Header />
            <Component {...pageProps} />
            <Footer />
          </EditorConfigProvider>
        </ModalProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
