import { createContext } from "react";

import IContext from "../helpers/interfaces/Web3FullInfo_Interfaces";


const data: IContext = {
    ethereum: null,
    web3Https: null,
    web3Wss: null,
    userAccount: "",
    txValidator: null,
    callValidator: null,
    ENS_Https: null,
    ENS_Wss: null
};

const Web3FullInfo = createContext(data);

export default Web3FullInfo;