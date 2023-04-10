import React, { useState, useCallback, useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Web3 from "web3";

import Web3FullInfo from "../context/Web3FullInfo";
import Ens from "../helpers/ENS_Contract_Data";


const List: React.FunctionComponent = (): JSX.Element => {
    const [ addr, setAddr ] = useState<string>("");
    const [ domain, setDomain ] = useState<string>("");
    const [ domainName, setDomainName ] = useState<string>("");
    const [ domainOwner, setDomainOwner ] = useState<string>(""); 
    const [ allDomains, setAllDomains ] = useState<any[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);

    const { ENS_Https, web3Https, callValidator } = useContext(Web3FullInfo);

    const web3 = useMemo(() => new Web3(
        new Web3.providers.HttpProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
        )
    ), []);

    const searchUserToDomain = useCallback(async (): Promise<boolean> => {
        if (await callValidator!()) {
            if (addr !== "" && web3Https?.utils.isAddress(addr)) {
                try {
                    const result = await ENS_Https.methods.userToDomain(addr).call();

                    setDomain(
                        result ? result : ""
                    );

                    if (!result) {
                        toast.warn("User does not own any domain !", {
                            toastId: "does not own any domain"
                        });

                        return false;
                    };

                    return true;
                } catch {
                    toast.error("Failed to get user domain", {
                        toastId: "Failed to get user domain"
                    });

                    return false;
                }
            } else {
                toast.warn("Please enter a valid address", {
                    toastId: "enter a valid address"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ ENS_Https, web3Https, callValidator, addr ]);

    const searchDomainToUser = useCallback(async (): Promise<boolean> => {
        if (await callValidator!()) {
            if (domainName !== "" && domainName.length >= 5) {
                try {
                    const addressZero = "0x0000000000000000000000000000000000000000";
                    const result = await ENS_Https.methods.domainToUser(domainName).call();

                    setDomainOwner(
                        result !== addressZero ? result : ""
                    );

                    if (result === addressZero) {
                        toast.warn("Domain does not have owner .", {
                            toastId: "Domain does not have owner ."
                        });

                        return false;
                    };

                    return true;
                } catch {
                    toast.error("Failed to fetch relevant owner's address !", {
                        toastId: "Failed to fetch relevant owner's address"
                    });

                    return false;
                };
            } else {
                toast.warn("Please enter valid domain name", {
                    toastId: "enter valid domain name"
                });

                return false;
            };
        } else {
            return false;
        };
    }, [ domainName, ENS_Https, callValidator ]);

    const trimeAddr = (addr: string): string | boolean => {
        try {
            const p1 = addr.slice(0, 5);
            const p2 = addr.slice(37, 42);

            return `0x${p1}.....${p2}`;
        } catch {
            console.log("Error occured while trying to trim the address !");
            return false;
        };
    };

    useEffect(() => {
        const init = async (): Promise<void> => {
            const ENS = new web3.eth.Contract(
                Ens.ABI,
                Ens.ADDRESS
            );
                
            let creationData: any[] = [];
            let transferData: any[] = [];
            let DATA: any[] = [];

            ENS.getPastEvents("DomainCreated", {
                fromBlock: Ens.CreationBlock,
                toBlock: "latest"
            }, async (err, events): Promise<void> => {
                if (!err) {
                    try {
                        for (const val of events) {
                            const Domain = val.returnValues.domainName, Owner = val.returnValues.creator;
    
                            const res = await ENS.methods.domainToUser(Domain).call();
    
                            if (creationData.length > 0) {
                                let state: boolean = true;
    
                                for (const val2 of creationData) {
                                    if (
                                        val2.returnValues.domainName === Domain &&
                                        val.returnValues.creator === Owner
                                    ) {
                                        state = false;
                                        break;
                                    }
                                };
    
                                if (state) {
                                    if (res === Owner) {
                                        creationData.push(val);
                                    };
                                };
                            } else {
                                if (res === Owner) {
                                    creationData.push(val);
                                };
                            };
                        };

                        ENS.getPastEvents("DomainTransfered", {
                            fromBlock: Ens.CreationBlock,
                            toBlock: "latest"
                        }, async (err, events): Promise<void> => {
                            if (!err) {
                                try {
                                    for (const val of events) {
                                        const Domain = val.returnValues.domainName, Owner = val.returnValues.to;
                
                                        const res = await ENS.methods.domainToUser(Domain).call();
                
                                        if (transferData.length > 0) {
                                            let state: boolean = true;
                
                                            for (const val2 of transferData) {
                                                if (
                                                    val2.returnValues.domainName === Domain &&
                                                    val.returnValues.to === Owner
                                                ) {
                                                    state = false;
                                                    break;
                                                }
                                            };
                
                                            if (state) {
                                                if (res === Owner) {
                                                    transferData.push(val);
                                                };
                                            };
                                        } else {
                                            if (res === Owner) {
                                                transferData.push(val);
                                            };
                                        };
                                    };
            
                                    //? Done
                                    creationData = creationData.map(val => {
                                        return { owner: val.returnValues.creator, domain: val.returnValues.domainName, time: val.returnValues.time };
                                    });
            
                                    transferData = transferData.map(val => {
                                        return { owner: val.returnValues.to, domain: val.returnValues.domainName, time: val.returnValues.time };
                                    });
            
            
                                    DATA = [...creationData, ...transferData];
            
                                    setAllDomains(DATA);
                                    setLoading(false);
                                } catch {
                                    toast.error("Failed to fetch domains list !", {
                                        toastId: "Failed to fetch domains list"
                                    });
                                };
                            } else {
                                toast.error("Failed to fetch domains list !", {
                                    toastId: "Failed to fetch domains list"
                                });
                            };
                        });
                    } catch {
                        toast.error("Failed to fetch domains list !", {
                            toastId: "Failed to fetch domains list"
                        });
                    };
                } else {
                    toast.error("Failed to fetch domains list !", {
                        toastId: "Failed to fetch domains list"
                    });
                };
            });
        };

        init();
    }, [ web3 ]);

    return (
        <section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Search
                            </div>
        
                            <div className="card-body">
                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter user address" onChange={e => {
                                        setAddr(
                                            e.target.value
                                        );
                                    }}/>

                                    <p className="form-control btn btn-info btn-block" onClick={async () => {
                                        await searchUserToDomain();
                                    }}>Search</p>
                                </form>

                                {
                                    domain ? (
                                        <div className="alert alert-info text-center">
                                            User domain - { domain }
                                        </div>
                                    ) : (
                                        null
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Search
                            </div>
        
                            <div className="card-body">
                                <form>
                                    <input type="text" className="form-control mb-3" placeholder="Enter domain name" onChange={e => {
                                        setDomainName(
                                            e.target.value
                                        );
                                    }}/>

                                    <p className="form-control btn btn-info btn-block" onClick={async () => {
                                        await searchDomainToUser();
                                    }}>Search</p>
                                </form>

                                {
                                    domainOwner ? (
                                        <div className="alert alert-info text-center">
                                            Domain owner - { domainOwner }
                                        </div>
                                    ) : (
                                        null
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                All Domains List
                            </div>
        
                            <div className="card-body">
                                {
                                    !loading ? (
                                        <table className="table mb-0">
                                            <caption>Domains - { allDomains.length }</caption>
        
                                            <thead className="table-dark">
                                                <tr className="text-center">
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Domain Name</th>
                                                    <th scope="col">Domain Owner</th>
                                                    <th scope="col">Created_At</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {
                                                    allDomains.map((val: any, index: number) => (
                                                        <tr key={index}>
                                                            <th>{ ++index }</th>
                                                            <td>{ val.domain }</td>
                                                            <td
                                                                title={`${val.owner}`}
                                                            >
                                                                { trimeAddr(val.owner) }
                                                            </td>
                                                            <td>{ (new Date(val.time * 1000)).toLocaleString() }</td>
                                                        </tr>
                                                    ))
                                                }                  
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="alert alert-info text-center shadow rounded">
                                            Loading domain data .....
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default List;
