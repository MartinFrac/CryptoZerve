import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MetamaskContextProvider } from "../context/MetamaskContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MetamaskContextProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </MetamaskContextProvider>
    </>
  );
}

export default MyApp;
