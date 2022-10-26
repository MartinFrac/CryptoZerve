import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { createContext } from "react";

type Props = {
  children: JSX.Element[];
};

type ContextProps = {
  account: any;
  connect: () => Promise<void>;
};

const MetamaskContext = createContext<ContextProps>({ account: null, connect: async () => {}});

export const MetamaskContextProvider: React.FC<Props> = ({ children }) => {
  const [mmAccount, setmmAccount] = useState(null);

  const connectMM = async () => {
    if (!window.ethereum) {
      alert("No provider injected in the browser");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length == 0) return;
    setmmAccount(accounts[0]);
  };

  return (
    <MetamaskContext.Provider value={{ account: mmAccount, connect: connectMM }}>
      {children}
    </MetamaskContext.Provider>
  );
};

export const useMMContext: () => ContextProps = () => {
  return useContext(MetamaskContext);
}
