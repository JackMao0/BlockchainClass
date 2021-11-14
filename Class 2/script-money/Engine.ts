import * as dotenv from "dotenv";
import Web3 from "web3";
import { ABIInfo } from "./ABILoader";
import moment from 'moment'
import erc20 from "./ABI/erc20";
import { Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common'
import { getWeiName, numberToString } from "./helper";

dotenv.config({ path: __dirname + '/.env' });

interface TxParams {
    fromAddress: string,
    toAddress: string,
    input: string,
    nonceNum: number,
    privKey: Buffer,
    gasPrice: string,
    amount: string,
    gaslimit: number
}

interface SwapInput {
    fromToken: string,
    toToken: string,
    tokenAmountIn: number,
    tokenAmountOut: number,
    tokendecimals?: number
}

export enum SwapType {
    ExactETHForTokens = 'swapExactETHForTokens',
    ExactTokensForETH = 'swapExactTokensForETH',
    ExactTokensForTokens = 'swapExactTokensForTokens'
}

interface ISwapOptions {
    swapType: SwapType,
    tokenSpendAmount: number
    tokenSpendAddress: string
    tokenRecieveAddress: string
    gasPrice: number
    gasLimit: number
    slippage?: number
}

interface approveOptions {
    tokenAddress: string,
    gasPrice: number,
    amount?: number
}

class Engine {
    private abiInfo!: ABIInfo
    private address!: string
    private priKey!: Buffer;
    private web3!: Web3;

    public constructor(
        abiInfo: ABIInfo) {
        this.abiInfo = abiInfo;
        if (process.env.PK === undefined) {
            console.error('Please set privatekey in .env');
        }
        this.priKey = Buffer.from(process.env.PK!.replace("0x", ""), "hex");
        this.web3 = new Web3(new Web3.providers.HttpProvider(abiInfo.rpc));
        this.address = this.web3.eth.accounts.privateKeyToAccount(this.priKey.toString('hex')).address;
    }

    public async swap({ swapType, tokenSpendAmount, tokenSpendAddress, tokenRecieveAddress, gasPrice, gasLimit: gaslimit, slippage }: ISwapOptions) {
        const fromAddress = this.address

        // 要获取的币的tokenContract
        const tokenContract = new this.web3.eth.Contract(erc20, tokenSpendAddress);

        // 获得代币有多少位小数
        const decimals = await tokenContract.methods.decimals().call();

        // 创建交易执行智能合约
        const toAddress = this.abiInfo.routerAddress;

        // 获得下一次交易的数
        const nonceCnt = await this.web3.eth.getTransactionCount(fromAddress);
        // 计算需要花费的token数
        const tokenSpend = this.web3.utils.toWei(numberToString(tokenSpendAmount), 'ether')
        const gasPriceGwei = this.web3.utils.toWei(numberToString(gasPrice), 'Gwei');

        const inputParams = {
            fromToken: tokenSpendAddress,
            toToken: tokenRecieveAddress,
            tokenAmountIn: Number(tokenSpend),
            tokenAmountOut: Number('0'),
            reciever: tokenRecieveAddress,
            tokendecimals: decimals
        }

        let inputInstance
        let amount = '0'
        switch (swapType) {
            case SwapType.ExactETHForTokens:
                inputInstance = await this.swapExactETHForTokensInput(inputParams)
                amount = tokenSpend
                break;
            case SwapType.ExactTokensForETH:
                inputInstance = await this.swapExactTokensForETHInput(inputParams)
                break;
            case SwapType.ExactTokensForTokens:
                inputInstance = await this.swapExactTokensForTokensInput(inputParams)
                break;
        }

        const transParams = {
            fromAddress,
            toAddress,
            input: inputInstance,
            nonceNum: nonceCnt,
            privKey: this.priKey,
            gasPrice: gasPriceGwei,
            amount,
            gaslimit
        }

        const result = await this.signTransaction(transParams)

        if (result) {
            console.log("swap交易成功")
        }
        else {
            console.log("swap交易失败")
        }
    }

    public async getETHBalance() {
        const result = await this.web3.eth.getBalance(this.address)
        const balance = this.web3.utils.fromWei(result, getWeiName());
        console.log(`钱包有 ${balance} 个 ETH`);
        return balance;
    }

    public async approve({ tokenAddress, gasPrice, amount }: approveOptions) {
        const erc20ABI = (await import('./ABI/erc20')).default
        const nonceCnt = await this.web3.eth.getTransactionCount(this.address);
        const gasPriceGwei = this.web3.utils.toWei(numberToString(gasPrice), 'Gwei');
        const tokenAmount = undefined === amount ? '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' : this.web3.utils.toWei(numberToString(amount), 'ether');
        const input = this.web3.eth.abi.encodeFunctionCall(erc20ABI[2], [this.abiInfo.routerAddress, tokenAmount])
        const transParams = {
            fromAddress: this.address,
            toAddress: tokenAddress,
            input: input,
            nonceNum: nonceCnt,
            privKey: this.priKey,
            gasPrice: gasPriceGwei,
            amount: '0',
            gaslimit: 70000
        }
        const result = await this.signTransaction(transParams)

        if (result) {
            console.log("approve交易成功")
        }
        else {
            console.log("approve交易失败")
        }
    }

    private async swapExactETHForTokensInput({ fromToken, toToken, tokenAmountOut }: SwapInput) {
        const path = [fromToken, toToken]
        const amountOutMin = numberToString(tokenAmountOut)
        const now = moment().unix();
        const deadline = Number(now + 60 * 20).toString(); // 往后延迟20分钟
        const input = this.web3.eth.abi.encodeFunctionCall(this.abiInfo.abi[0], [amountOutMin, path as unknown as string, this.address, deadline]);
        return input;
    }

    private async swapExactTokensForETHInput({ fromToken, toToken, tokenAmountIn, tokenAmountOut }: SwapInput) {
        const path = [fromToken, toToken]
        const amountIn = numberToString(tokenAmountIn);
        const amountOutMin = numberToString(tokenAmountOut)
        const now = moment().unix();
        const deadline = Number(now + 60 * 20).toString(); // 往后延迟20分钟
        console.log('swapExactTokensForETHInput', { amountIn, amountOutMin, path: path as unknown as string, to: this.address, deadline });

        const input = this.web3.eth.abi.encodeFunctionCall(this.abiInfo.abi[1], [amountIn, amountOutMin, path as unknown as string, this.address, deadline]);
        return input;
    }

    private async swapExactTokensForTokensInput({ fromToken, toToken, tokenAmountIn, tokenAmountOut }: SwapInput) {
        const path = [fromToken, toToken]
        const amountIn = numberToString(tokenAmountIn)
        const amountOutMin = numberToString(tokenAmountOut)
        const now = moment().unix();
        const deadline = Number(now + 60 * 20).toString(); // 往后延迟20分钟
        const input = this.web3.eth.abi.encodeFunctionCall(this.abiInfo.abi[2], [amountIn, amountOutMin, path as unknown as string, this.address, deadline]);
        return input;
    }

    private async signTransaction({ fromAddress, toAddress, input, nonceNum, privKey, gasPrice, amount, gaslimit }: TxParams) {
        const common = Common.custom({ chainId: this.abiInfo.chainID })
        const rawTransaction = {
            "from": fromAddress, // 自己的地址
            "nonce": this.web3.utils.toHex(nonceNum),
            "gasLimit": this.web3.utils.toHex(gaslimit),
            "gasPrice": this.web3.utils.toHex(gasPrice),
            "to": toAddress, // 合约地址
            "value": this.web3.utils.toHex(amount),
            "data": input,
        };
        const tx = Transaction.fromTxData(rawTransaction, { common });
        const signedTx = tx.sign(privKey);
        const serializedTx = signedTx.serialize();
        const receipt = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
        return receipt.status === true;
    }

}

export default Engine;