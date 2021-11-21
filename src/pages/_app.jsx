import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import { Header, Footer } from "../components";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default MyApp;
