import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { createContext } from "react";

type Props = {
  children: JSX.Element[];
};

type ContextProps = {
  account: any;
  provider: any;
  connect: () => Promise<void>;
};

const MetamaskContext = createContext<ContextProps>({
  account: null,
  provider: undefined,
  connect: async () => {},
});

export const MetamaskContextProvider: React.FC<Props> = ({ children }) => {
  const [mmAccount, setmmAccount] = useState(null);
  const [provider, setProvider] = useState({});

  const connectMM = async () => {
    if (!window.ethereum) {
      alert("No provider injected in the browser");
      return;
    }
    const providerLocal = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(providerLocal);
    const accounts = await providerLocal.send("eth_requestAccounts", []);
    if (accounts.length == 0) return;
    setmmAccount(accounts[0]);
    window.ethereum.on('accountsChanged', (accounts: any) => {
      setmmAccount(accounts[0])
    })
  };

  return (
    <MetamaskContext.Provider
      value={{ account: mmAccount, provider: provider, connect: connectMM }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export const useMMContext: () => ContextProps = () => {
  return useContext(MetamaskContext);
};
