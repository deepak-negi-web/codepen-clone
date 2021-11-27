import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { GlobalStyles } from "twin.macro";
import { Header, Footer } from "../components";
import { ApolloProvider } from "../providers";
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ApolloProvider>
  );
}

export default MyApp;
