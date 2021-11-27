import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
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
