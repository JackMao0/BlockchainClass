import Engine, { SwapType } from "./Engine";
import { loadAbiMap, getAbi, ABIInfo } from "./ABILoader";

async function main() {
    const abiInfo: ABIInfo = await loadAbiMap('pancakeV2', './ABI/pancake.ts');
    const engine = new Engine(abiInfo);
    const generateToken = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c' // wbnb
    const tokenToSwap_01 = '0x12bb890508c125661e03b09ec06e404bc9289040' // raca
    const tokenToSwap_02 = '0xdf48cc5e7618b12b69d6c353e569f3083a8e2be6' // pt
    const tokenToSwap_03 = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' // usdc


    //  固定数量的eth换token
    // const result = await engine.swap({
    //     swapType: SwapType.ExactETHForTokens,
    //     tokenSpendAmount: 0.01,
    //     tokenSpendAddress: generateToken,
    //     tokenRecieveAddress: tokenToSwap_01,
    //     gasPrice: 5, // 抢先交易设置到10以上
    //     gasLimit: 420000,
    //     slippage: 100
    // })


    // approve无限数量的代币给swap
    // const result = await engine.approve({
    //     tokenAddress: tokenToSwap_01,
    //     gasPrice: 5,
    // })


    // 固定数量的token换eth
    // const result = await engine.swap({
    //     swapType: SwapType.ExactTokensForETH,
    //     tokenSpendAmount: 568.84904610419,
    //     tokenSpendAddress: tokenToSwap_01, // 土狗
    //     tokenRecieveAddress: generateToken, // eth
    //     gasPrice: 5,
    //     gasLimit: 420000,
    //     slippage: 100
    // })

    // 固定数量的token换token
    const result = await engine.swap({
        swapType: SwapType.ExactTokensForTokens,
        tokenSpendAmount: 1,
        tokenSpendAddress: tokenToSwap_01,
        tokenRecieveAddress: tokenToSwap_03,
        gasPrice: 5,
        gasLimit: 420000,
        slippage: 100
    })

    return result
}

main()