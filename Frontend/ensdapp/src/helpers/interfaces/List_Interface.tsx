interface IEventData {
    address: string,
    blockHash: string,
    blockNumber: number,
    event: string,
    id: string,
    logIndex: number,
    raw: {
        data: string,
        topics: string[]
    },
    removed: boolean,
    returnValues: any,
    signature: string,
    transactionHash: string,
    transactionIndex: number
};

export default IEventData;