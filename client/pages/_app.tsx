import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MetamaskContextProvider } from "../context/MetamaskContext";
import { FiltersContextProvider } from "../context/FiltersContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MetamaskContextProvider>
        <Header />
        <main className="min-h-[calc(100vh-6rem)] px-[6rem] py-[6rem]">
          <FiltersContextProvider>
            <Component {...pageProps} />
          </FiltersContextProvider>
        </main>
        <Footer />
       
      </MetamaskContextProvider>
    </>
  );
}

export default MyApp;
