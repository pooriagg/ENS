import React, { useState, useCallback, useContext, useEffect } from "react";
import { toast } from "react-toastify";

import Web3FullInfo from "../context/Web3FullInfo";


const Index: React.FunctionComponent = (): JSX.Element => {
    const [ loadingCreating, setLoadingCreating ] = useState<boolean>(false);
    const [ loadingTransfer, setLoadingTransfer ] = useState<boolean>(false);
    const [ loadingDestroy, setLoadingDestroy ] = useState<boolean>(false);

    const [ domainCreating, setDomainCreating ] = useState<string>("");
    const [ domainTransfer, setDomainTransfer ] = useState<string>("");
    const [ recepient, setRecepient ] = useState<string>("");
    const [ domainDestroy, setDomainDestroy ] = useState<string>("");

    const [ userDomain, setUserDomain ] = useState<string | null>(null);

    const { ENS_Https, txValidator, userAccount, web3Https } = useContext(Web3FullInfo);

    const createDomain = useCallback(async (): Promise<boolean> => {
        if (await txValidator!()) {
            if (domainCreating !== "") {
                try { 
                    setLoadingCreating(true);
    
                    await ENS_Https.methods.createDomain(domainCreating).send();

                    toast.success(`You created and owned domain "${domainCreating}" .`, {
                        toastId: "created and owned domain"
                    });
    
                    setLoadingCreating(false);

                    return true;
                } catch {
                    setLoadingCreating(false);

                    toast.error("Failed to create a new domain!", {
                        toastId: "Failed to create a new domain!"
                    });
        
                    return false;
                };
            } else {
                toast.warn("Please enter a domain name", {
                    toastId: "Please enter a domain name"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ txValidator, domainCreating, ENS_Https ]);

    const transferDomain = useCallback(async (): Promise<boolean> => {
        if (await txValidator!()) {
            if (
                domainTransfer !== "" &&
                recepient !== "" &&
                web3Https?.utils.isAddress(recepient)
            ) {
                try {
                    setLoadingTransfer(true);

                    await ENS_Https.methods.transferDomain(domainTransfer, recepient).send();

                    toast.success("Domain transfered succesfully .", {
                        toastId: "Domain transfered succesfully"
                    });

                    setLoadingTransfer(false);

                    return true;
                } catch {
                    setLoadingTransfer(false);

                    toast.error("Falied to transfer the domain .", {
                        toastId: "Falied to transfer the domain ."
                    });

                    return false;
                };
            } else {
                toast.warn("Please enter valid data into inputs!", {
                    toastId: "Please enter valid data into inputs!"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ txValidator, web3Https, ENS_Https, domainTransfer, recepient ]);

    const destroyDomain = useCallback(async (): Promise<boolean> => {
        if (await txValidator!()) {
            if (domainDestroy !== "") {
                try { 
                    setLoadingDestroy(true);
    
                    await ENS_Https.methods.destroyDomain(domainDestroy).send();

                    toast.success(`You destroyed domain "${domainDestroy}" .`, {
                        toastId: "destroyed domain"
                    });
    
                    setLoadingDestroy(false);

                    return true;
                } catch(e) {
                    console.log(e);
                    setLoadingDestroy(false);

                    toast.error("Failed to destroy the domain!", {
                        toastId: "Failed to destroy the domain!"
                    });
        
                    return false;
                };
            } else {
                toast.warn("Please enter a domain name", {
                    toastId: "Please enter a domain name"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ txValidator, ENS_Https, domainDestroy ]);

    useEffect(() => {
        const getuserData = async (): Promise<void> => {
            try {
                const domain = await ENS_Https.methods.userToDomain(userAccount).call();

                if (domain !== "") {
                    setUserDomain(domain);
                };
            } catch {
                console.log("Error in fetching user domain data !");
            };
        };

        if (userAccount !== "") {
            getuserData();
        }
    }, [ userAccount, ENS_Https ]);

    return (
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Create a domain
                            </div>
        
                            <div className="card-body">
                                {
                                    userDomain != null ? (
                                        <div className="alert alert-info text-center shadow rouded">
                                            Your ENS Domain - {userDomain}
                                        </div>
                                    ) : (null)
                                }

                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter domain's name" onChange={e => {
                                        setDomainCreating(e.target.value);
                                    }}/>

                                    {
                                        !loadingCreating ? (
                                            <p className="form-control btn btn-primary btn-block" onClick={async () => {
                                                await createDomain();
                                            }}>Create</p>
                                        ) : (
                                            <p className="form-control btn btn-secondary btn-block">Creating.....</p>
                                        )
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Transfer your domain
                            </div>
        
                            <div className="card-body">
                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter domain's name" onChange={e => {
                                        setDomainTransfer(e.target.value);
                                    }}/>
                                    <input type="text" className="form-control mb-3" placeholder="Enter recepient address" onChange={e => {
                                        setRecepient(e.target.value);
                                    }}/>

                                    {
                                        !loadingTransfer ? (
                                            <p className="form-control btn btn-warning btn-block" onClick={async () => {
                                                await transferDomain();
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

                <div className="row">
                    <div className="col-6 mx-auto mt-5 mb-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Destroy your domain
                            </div>
        
                            <div className="card-body">
                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter domain's name" onChange={e => {
                                        setDomainDestroy(e.target.value);
                                    }}/>

                                    {
                                        !loadingDestroy ? (
                                            <p className="form-control btn btn-danger btn-block" onClick={async () => {
                                                await destroyDomain();
                                            }}>Destroy</p>
                                        ) : (
                                            <p className="form-control btn btn-secondary btn-block">Destroying.....</p>
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

export default Index;
