import Web3 from "web3";

export default interface IContext {
    ethereum: any,
    web3Https: Web3 | null,
    web3Wss: Web3 | null,
    userAccount: string,
    txValidator: (() => Promise<boolean>) | null,
    callValidator: (() => Promise<boolean>) | null,
    ENS_Https: any,
    ENS_Wss: any
};