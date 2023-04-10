import React, { useContext, useEffect, useState, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import Web3FullInfo from "../context/Web3FullInfo";


const Navbar: React.FunctionComponent<{ setUserAccount: any }> = ({ setUserAccount }: { setUserAccount: any }): JSX.Element => {
    const { userAccount, web3Https, ethereum } = useContext(Web3FullInfo);

    const [ connecting, setConnecting ] = useState<boolean>(false);

    const connect = useCallback(async (): Promise<void> => {
        setConnecting(true);
    
        await toast.promise(
            ethereum.request({
                method: "eth_requestAccounts",
                params: []
            }).then(([ account ]: [ account: string ]) => {
                if (account && web3Https?.utils?.isAddress(account)) {
                    setUserAccount(
                        web3Https?.utils.toChecksumAddress(account)
                    );
                } else {
                    toast.error("Failed to fetch your account", {
                        toastId: "cannot fetch user account (1)"
                    });
                };
            }).catch(() => {
                toast.error("Failed to fetch your account. Please try again", {
                    toastId: "cannot fetch user account (2)"
                });
            }),
            {
                pending: "Connecting your wallet to the ens dapp",
                success: "Wallet connected",
                error: "Failed to connected your wallet"
            }
        );
    
        setConnecting(false);
    }, [ ethereum, web3Https, setUserAccount ]);

    useEffect(() => {
        toast.info("We recommand you to use MetaMask as your web3 wallet. Please connect to Mumbai testnet", {
            toastId: "Recommand"
        });
    }, []);
    
    useEffect(() => {
        if (userAccount !== "") {
          console.log(`Connected account => ${userAccount}.`);
    
          ethereum.on("accountsChanged", () => {
            if (ethereum.selectedAddress == null) {
              toast.warn("Your wallet has been locked. Click to unlock it", {
                onClick: connect,
                toastId: "AccountChanged"
              });
            } else {
              toast.warn("You have changed your account. Click to connect again", {
                onClick: connect,
                toastId: "AccountChanged"
              });
            };
          });
        } else {
          console.warn("MetaMask wallet is not connected !");
        };
    }, [ userAccount, ethereum, connect ]);

    return (
        <nav>
            <header className="mb-3">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link to="/" className="navbar-brand">
                            <img src="https://etherscan.io/images/svg/brands/ethereum-original.svg" width="38" height="38" alt="Ethereum" title="Ethereum NFT Marketplace"/>
                        </Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <Link to="/" className="navbar-brand">Ethereum Name Service</Link>

                        <div className="collapse navbar-collapse" id="navbar">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link to="/transferEtherViaEns" className="nav-link">
                                        Transfer Ether Via ENS
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/ensLists" className="nav-link">
                                        All ENS List
                                    </Link>
                                </li>
                            </ul>
                            
                            <div className="d-flex">
                                <div>
                                    {
                                        userAccount === "" ? (
                                            !connecting ? (
                                                <button className="btn btn-dark small" onClick={connect}>Connect</button> 
                                            ) : (
                                                <button className="btn btn-secondary small">Connecting.....</button> 
                                            )
                                        ) : (
                                            <>
                                                <button id="conBtn" className="btn btn-outline-dark small" style={{fontWeight: "490"}} onMouseOver={(e: any) => {
                                                const addr = String(userAccount);
                                                
                                                const p1 = addr.slice(0, 5);
                                                const p2 = addr.slice(38, 42);
                                                const p3 = `${p1}......${p2}`;

                                                e.target.innerText = p3;
                                                }} onMouseOut={(e: any) => {
                                                e.target.innerText = "Connected";
                                                }}>Connected</button>

                                                <Tooltip
                                                    anchorId="conBtn"
                                                    content={web3Https!.utils.toChecksumAddress(userAccount)}
                                                    place="bottom"
                                                    style={{
                                                        paddingTop: "2px",
                                                        paddingBottom: "2px",
                                                        paddingLeft: "7px",
                                                        paddingRight: "7px",
                                                        backgroundColor: "black"
                                                    }}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="colored"
            />
        </nav>
    );
};

Navbar.propTypes = {
    setUserAccount: PropTypes.func
};

export default Navbar;
