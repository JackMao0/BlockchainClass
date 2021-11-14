import Web3 from "web3";
import { AbiItem } from 'web3-utils';

export interface ABIInfo {
    routerAddress: string
    rpc: string
    abi: AbiItem[]
    chainID: number
}

// 创建一个ABIMAP放所有的ABI
const allABIMap = new Map<string, Map<string, AbiItem>>();

// 只是用来签名一下函数，不需要连接网络
const webTmp = new Web3()

// 加载ABI
async function loadAbiMap(abiMapName: string, url: string) {
    const abiInfo = (await import(url)).default
    const abiItems: AbiItem[] = abiInfo.abi;
    const tmpAbiMap = new Map<string, AbiItem>();

    for (const abiItem of abiItems) {
        if (abiItem.type === "function") {
            const sign = webTmp.eth.abi.encodeFunctionSignature(abiItem);
            tmpAbiMap.set(sign, abiItem);
        }
    }

    if (tmpAbiMap.size !== 0) {
        allABIMap.set(abiMapName, tmpAbiMap)
    }
    return abiInfo
}

interface IGetABIResult {
    isABIFound: boolean;
    abiItem?: AbiItem;
}

// 构造input数据的时候，通过该方法读具体的ABI 中的某个功能
async function getAbi(abiMapName: string, functionName: string): Promise<IGetABIResult> {
    const abiItemMap = allABIMap.get(abiMapName)

    if (abiItemMap === undefined) {
        return { isABIFound: false }
    }

    for (const [, abiItem] of abiItemMap) {
        if (abiItem.name === functionName) {
            return {
                isABIFound: true, abiItem: abiItem
            };
        }
    }
    return { isABIFound: false }
}

export { loadAbiMap, getAbi }