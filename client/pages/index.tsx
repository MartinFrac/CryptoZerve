import type { NextPage } from "next";
import Head from "next/head";
import Activity from "../components/Activity";
import Programme from "../components/Programme";

const Home: NextPage = () => {
  return (
    <div className="text-center">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-[2rem] text-gray-700">Find your next activity...</h1>
        <Activity />
        <Programme />
      </div>
    </div>
  );
};

export default Home;
