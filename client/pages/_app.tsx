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
        <main className="min-h-[calc(100vh-6rem)] px-[14rem] py-[10rem] bg-gray-700">
          <div className="flex flex-col items-center bg-white rounded-md py-10">
            <FiltersContextProvider>
              <Component {...pageProps} />
            </FiltersContextProvider>
          </div>
        </main>
        <Footer />
      </MetamaskContextProvider>
    </>
  );
}

export default MyApp;
