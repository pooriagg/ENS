import React from 'react';
import { useState, useMemo, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Web3 from "web3";

import Navbar from './components/Navbar';
import Index from './components/Index';
import NotFound from './components/NotFound';
import Transfer from './components/Transfer';
import List from './components/List';
import ENS from './helpers/ENS_Contract_Data';

import Web3FullInfo from "./context/Web3FullInfo";


declare const window: any;

const App: React.FunctionComponent = (): JSX.Element => {
  const [ userAccount, setUserAccount ] = useState<string>("");
  
  // const web3Https = useMemo(() => new Web3(
  //   new Web3.providers.HttpProvider(
  //     "https://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
  //   )
  // ), []);

  const web3Wss = useMemo(() => new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
    )
  ), []);

  const { ethereum } = useMemo(() => window, []);

  const web3Https = useMemo(() => new Web3(ethereum), [ ethereum ]);

  // const web3Wss = useMemo(() => new Web3(ethereum), [ ethereum ]);

  const ENS_Https = useMemo(() => {
    return (
      new web3Https.eth.Contract(
        ENS.ABI,
        ENS.ADDRESS,
        {
          from: userAccount
        }
      )
    );
  }, [ userAccount, web3Https ]);

  const ENS_Wss = useMemo(() => {
    return (
      new web3Wss.eth.Contract(
        ENS.ABI,
        ENS.ADDRESS,
        {
          from: userAccount
        }
      )
    );
  }, [ userAccount, web3Wss ]);

  const addMumbaiChain = useCallback((): boolean => {
    try {
      toast.promise(
        ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{
            chainId: `${web3Https.utils.toHex(80001)}`
          }]
        }),
        {
          pending: "Switching to Mumbai chain",
          success: "You are connected to the chain",
          error: "Connection failed"
        }
      );

      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
  
          const chainMetadata = {
            chainId: `0x${Number(80001).toString(16)}`,
            chainName: "Mumbai-Testnet",
            nativeCurrency: {
              name: "Matic",
              "symbol": "MATIC",
              decimals: 18
            },
            rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
            blockExplorerUrls: ["https://goerli.etherscan.io"]
          };
  
          toast.promise(
            ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chainMetadata ]
            }),
            {
              pending: "Adding and connecting to Mumbai chain",
              success: "You are connected to the chain",
              error: "Connection failed"
            }
          );
          
          return true;
        } catch (error: any) {
          toast.warn("Error in adding Mumbai to your wallet", {
            toastId: "Error in adding Mumbai to your wallet"
          });
          console.warn("Error =>", error.message);
          return false;
        }
      } else {
        toast.warn("Unexpected error while switching chian occured", {
          toastId: "Unexpected error while switching chian occured"
        });
        return false;
      }
    };
  }, [ ethereum, web3Https ]);

  const validator_tx = useCallback(async (): Promise<boolean> => {
    if (userAccount !== "") {
      if (await ethereum.isMetaMask) {
        if (await ethereum.isConnected()) {
          if (await ethereum.networkVersion === "80001") {
            if (await ethereum._state.isUnlocked) {
              return true;
            } else {
              toast.warn("Please unlock your wallet", {
                toastId: "Please unlock your wallet"
              });
              return false;
            };
          } else {
            toast.info("Please change your chain to Mumbai OR click here to change it", {
              onClick: addMumbaiChain,
              toastId: "Please change your chain to Mumbai OR click here to change it"
            });
            return false;
          };
        } else {
          toast.error("Please check your network, you are not connected to the blockchain", {
            toastId: "Please check your network, you are not connected to the blockchain"
          });
          return false;
        };
      } else {
          toast.warn("Please install MetaMask. We only support MetaMask right now", {
            toastId: "Please install MetaMask. We only support MetaMask right now"
        });
        return false;
      };
    } else {
      toast.warn("Please connect your wallet", {
        toastId: "Please connect your wallet"
      });
      return false;
    }
  }, [ addMumbaiChain, ethereum, userAccount ]);
  
  const validator_call = useCallback(async (): Promise<boolean> => {
    if (userAccount !== "") {
      if (await ethereum.isMetaMask) {
        if (await ethereum.networkVersion === "80001") {
          return true;
        } else {
          toast.info("Please change your chain to Mumbai OR click here to change it", {
            onClick: addMumbaiChain,
            toastId: "switch to correct chain (Mumbai)"
          });
          return false;
        };
      } else {
        toast.warn("Please install MetaMask. We only support MetaMask right now", {
          toastId: "Please install MetaMask. We only support MetaMask right now"
        });
        return false;
      };
    } else {
      toast.warn("Please connect your wallet", {
        toastId: "Please connect your wallet"
      });
      return false;
    };
  }
  , [ addMumbaiChain, ethereum, userAccount ]);

  useMemo(() => {
    ethereum.on("chainChanged", (): void => {
      toast.warn("You have changed your chain. Click to switch it to the correct chain", {
        toastId: "Chain Changed",
        onClick: addMumbaiChain
      });
    });
  }, [ addMumbaiChain, ethereum ]);

  return (
    <Web3FullInfo.Provider value={{
      ethereum,
      web3Https,
      web3Wss,
      userAccount,
      txValidator: validator_tx,
      callValidator: validator_call,
      ENS_Https,
      ENS_Wss
    }}>
      <>
        <Navbar setUserAccount={setUserAccount} />

        <Routes>
          <Route path='/' element={<Navigate to="/ens" />} />
          <Route path='/ens' element={<Index /> } />
          <Route path='/ensLists' element={<List /> } />
          <Route path='/transferEtherViaEns' element={<Transfer /> } />

          <Route path='*' element={<NotFound />}/>
        </Routes>
      </>
    </Web3FullInfo.Provider>
  );
};

export default App;