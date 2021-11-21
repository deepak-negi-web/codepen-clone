import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import { Header } from "../components";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
