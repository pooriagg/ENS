import React from "react";
import { useState, useContext, useCallback } from "react";
import { toast } from "react-toastify";

import Web3FullInfo from "../context/Web3FullInfo";

const Transfer: React.FunctionComponent = (): JSX.Element => {
    const [ recepientDomain, setRecepientDomain ] = useState<string>("");
    const [ fund, setFund ] = useState<string>("0");
    const [ loading, setLoading ] = useState<boolean>(false);

    const { ENS_Https, web3Https, txValidator, userAccount } = useContext(Web3FullInfo);

    const transfer = useCallback(async (): Promise<boolean> => {
        if (await txValidator!()) {
            if (recepientDomain !== "" && fund !== "0") {
                try {
                    setLoading(true);

                    if (
                        await ENS_Https.methods.isExists(recepientDomain).call()
                    ) {
                        let to: string, value: any, from: string;

                        to = await ENS_Https.methods.domainToUser(recepientDomain).call();
                        from = userAccount;
                        value = web3Https?.utils?.numberToHex(
                            web3Https?.utils?.toBN(
                                web3Https!.utils!.toWei(fund, "ether")
                            )
                        );

                        const TX = {
                            to,
                            from,
                            value
                        };

                        await web3Https?.eth.sendTransaction(TX);

                        toast.success("Funds transfered successfully .", {
                            toastId: "Funds transfered successfully ."
                        });

                        setLoading(false);

                        return true;
                    } else {
                        setLoading(false);

                        toast.warn("Invalid domain name !", {
                            toastId: "Invalid domain name !"
                        });

                        return false;
                    };
                } catch {
                    setLoading(false);

                    toast.error("Falied to transfer", {
                        toastId: "Falied to transfer"
                    });

                    return false;
                };
            } else {
                toast.warn("Please enter valid data", {
                    toastId: "Please enter valid data"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ web3Https, ENS_Https, txValidator, recepientDomain, fund, userAccount ]);

    return (
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Transfer Via ENS
                            </div>
        
                            <div className="card-body">
                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter recepient domain" onChange={e => {
                                        setRecepientDomain(e.target.value);
                                    }}/>

                                    <input type="number" className="form-control mb-3" placeholder="Enter value" onChange={e => {
                                        setFund(e.target.value);
                                    }}/>

                                    {
                                        !loading ? (
                                            <p className="form-control btn btn-info btn-block" onClick={async () => {
                                                await transfer();
                                            }}>Transfer</p>
                                        ) : (
                                            <p className="form-control btn btn-secondary btn-block">Transfering.....</p>
                                        )
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Transfer;