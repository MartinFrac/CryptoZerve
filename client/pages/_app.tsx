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
        <div className="min-h-[calc(100vh-6rem)]">
          <Component {...pageProps} />
        </div>
        <Footer />
      </MetamaskContextProvider>
    </>
  );
}

export default MyApp;
