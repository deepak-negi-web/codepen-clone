import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { GlobalStyles } from "twin.macro";
import { Header, Footer, ModalManager } from "../components";
import { ApolloProvider, ModalProvider } from "../providers";
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider>
      <ModalProvider>
        <GlobalStyles />
        <ModalManager />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ModalProvider>
    </ApolloProvider>
  );
}

export default MyApp;
