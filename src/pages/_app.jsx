import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Header, Footer, ModalManager } from "../components";
import { ApolloProvider, ModalProvider } from "../providers";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ApolloProvider>
      <ModalProvider>
        <GlobalStyles />
        <ModalManager />
        <SessionProvider session={session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
        <Footer />
      </ModalProvider>
    </ApolloProvider>
  );
}

export default MyApp;
