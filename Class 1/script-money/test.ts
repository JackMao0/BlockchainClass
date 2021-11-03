// 这里用bsc 链举例子
// 加载web3的库
import Web3 from "web3";
import Utils from 'web3-utils';

// 创建 rpc 连接字符串
const rpcstring = 'https://bsc-dataseed1.binance.org/'
// 创建ws连接字符串
const wstring = 'wss://bsc-ws-node.nariox.org:443';

// wbnb地址
const wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"

// 第三部分的收款地址
const walletaddress = "0x49E53Fb3d5bf1532fEBAD88a1979E33A94844d1d"

// 第三，四部分要用到的私钥
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
let prikeystring = process.env.PK; // 这里填自己的私钥

// 第四部分，要交换哪个代币的地址
const tokenaddress = "0xdf48cc5e7618b12b69d6c353e569f3083a8e2be6";// 自己设置要交换的tokenaddress

const wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring));
const rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring));

// 设置web3 使用rpcweb3模式
const web3 = rpcweb3;

// 通过小数点多少位，转换对应的数据
function getweiname(tokendecimals = 18): Utils.Unit {
    let weiname = 'ether' as Utils.Unit;
    switch (tokendecimals) {
        case 3:
            weiname = "Kwei";
            break;
        case 6:
            weiname = 'mwei';
            break;
        case 9:
            weiname = 'gwei';
            break;
        case 12:
            weiname = 'microether';
            break;
        case 15:
            weiname = 'milliether';
            break;
        case 18:
            weiname = 'ether';
            break;

    }
    return weiname;
}

// 因为是通过网络查询，所以要使用 async模式才能查询，不适用 async 不会使用阻塞模式
const getBNBBalance = async (address: string) => {
    const result = await web3.eth.getBalance(address)
    // 由于使用的是大数模式，小数点有18位，所以获得的balance 要除以10^18次方才是正确的数据
    // 或者使用自带的转换工具
    const balance = web3.utils.fromWei(result.toString(), getweiname());
    // 打印结果
    console.log("地址:" + address + "有" + balance + "个BNB");
    return balance;
}

// 读取bnb余额
// getBNBBalance(addressToCheck)

import erc20 from "./erc20";

// 获得代币数量
const getTokenBalance = async (tokenaddress: string, address: string) => {
    // 创建代币的智能合约函数
    const tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    // 调用代币的智能合约获取余额功能
    const result: string = await tokenContract.methods.balanceOf(address).call();

    // 获得代币有多少位小数
    const decimals: string = await tokenContract.methods.decimals().call();
    const weiname = getweiname(Number(decimals));
    const tokenbalance = web3.utils.fromWei(result.toString(), weiname);

    // 获得代币的符号
    const symbol: string = await tokenContract.methods.symbol().call();

    // 打印结果
    console.log("地址:" + address + "有代币:" + symbol + "的数量是:" + tokenbalance);
    return tokenbalance;
}

// 用私钥将交易内容签名
import { Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common'

// 这里是加载私钥的部分
prikeystring = prikeystring!.replace("0x", "")
function getPriKey(prikeystring: string) {
    const privKey = Buffer.from(prikeystring, "hex");
    return privKey;
}

// 这里的privKey 是私钥
const priKey = getPriKey(prikeystring);

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

// 这里是将交易用私钥签名部分
function getEthRawTx({ fromAddress, toAddress, input, nonceNum, privKey, gasPrice, amount, gaslimit }: TxParams) {
    const common = Common.custom({ chainId: 0x38 })
    const rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(gaslimit),
        "gasPrice": web3.utils.toHex(gasPrice),
        "to": toAddress,
        "value": web3.utils.toHex(amount),
        "data": input,  // 设置num属性
    };

    const tx = Transaction.fromTxData(rawTransaction, { common });
    const signedTx = tx.sign(privKey);
    const serializedTx = signedTx.serialize();
    return serializedTx;
}

// 这里是将签名的内容发送到区块链网络中的代码
const signTransaction = async ({ fromAddress, toAddress, input, nonceNum, privKey, gasPrice, amount, gaslimit }: TxParams) => {
    const serializedTx = getEthRawTx({ fromAddress, toAddress, input, nonceNum, privKey, gasPrice, amount, gaslimit })

    // Comment out these three lines if you don't really want to send the TX right now
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
    return receipt.status === true;
}

const send = async () => {
    // 获得自己的地址
    const fromAddress = web3.eth.accounts.privateKeyToAccount(priKey.toString('hex')).address;

    // 发送给谁
    const toAddress = walletaddress

    const nsendBNB = 0.001
    // 假设交易 0.001个bnb
    const nbnb = web3.utils.toWei((nsendBNB).toString(), 'ether');
    // 设置gasprice 为 5G wei
    const gasPrice = web3.utils.toWei((5).toString(), 'Gwei');
    // 设置 gaslimit 为 420000
    const gaslimit = 420000
    // 没有调用智能合约，将input设置为空
    const input = ""
    // 获得下一次交易的数
    console.log("发送地址是：" + fromAddress)
    const nonceCnt = await web3.eth.getTransactionCount(fromAddress);

    const reslut = await signTransaction({ fromAddress, toAddress, input, nonceNum: nonceCnt, privKey: priKey, gasPrice, amount: nbnb, gaslimit })
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}

const transferERC20 = async () => {
    // 获得自己的地址
    const fromAddress = web3.eth.accounts.privateKeyToAccount(priKey.toString('hex')).address;

    // 发送到代币合约地址
    const toAddress = tokenaddress
    const tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    // 转移10000个
    const nsendToken = 10000
    const nToken = web3.utils.toWei((nsendToken).toString(), 'ether');
    // 设置gasprice 为 5G wei
    const gasPrice = web3.utils.toWei((5).toString(), 'Gwei');
    // 设置 gaslimit 为 80000
    const gaslimit = 80000
    // 调用transfer方法
    const input = tokenContract.methods.transfer(toAddress, nToken).encodeABI()
    // 获得下一次交易的数
    console.log("发送地址是：" + fromAddress)
    const nonceCnt = await web3.eth.getTransactionCount(fromAddress);

    const reslut = await signTransaction({ fromAddress, toAddress, input, nonceNum: nonceCnt, privKey: priKey, gasPrice, amount: nToken, gaslimit })
    if (reslut) {
        console.log("transfer代币成功")
    }
    else {
        console.log("transfer代币失败")
    }
}

import pancake from "./pancake";

interface SwapInput {
    wbnbaddress: string,
    toaddress: string,
    tokenamountIn: number,
    tokenAmountOut: number,
    tokenaddress: string,
    tokendecimals?: number
}

// 获取input内容
function swaptokeninput({ wbnbaddress, toaddress, tokenamountIn, tokenAmountOut, tokenaddress, tokendecimals = 18 }: SwapInput) {

    const weiname = getweiname(tokendecimals);

    const path = [wbnbaddress, tokenaddress]

    const amountOutMin = web3.utils.toWei(tokenAmountOut.toString(), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; // 往后延迟20分钟

    const deadline = (DEADLINE).toString();

    const input = web3.eth.abi.encodeFunctionCall(pancake[0], [amountOutMin, path as unknown as string, toaddress, deadline]);
    return input;
}

function tokensToEthInput({ wbnbaddress, toaddress, tokenamountIn, tokenAmountOut, tokenaddress, tokendecimals = 18 }: SwapInput) {

    const weiname = getweiname(tokendecimals);

    const path = [tokenaddress, wbnbaddress]
    console.log('tokenamountIn', tokenamountIn)
    console.log('tokenAmountOut', tokenAmountOut)
    const amountIn = web3.utils.toWei(tokenamountIn.toString(), weiname);
    const amountOutMin = web3.utils.toWei(tokenAmountOut.toString(), weiname);

    const to = toaddress

    const now = moment().unix();
    const DEADLINE = now + 60 * 20; // 往后延迟20分钟
    const deadline = (DEADLINE).toString();

    const input = web3.eth.abi.encodeFunctionCall(pancake[1], [amountIn, amountOutMin, path as unknown as string, to, deadline]);
    console.log(input)
    return input;
}

import moment from 'moment'

const swap = async () => {
    // 获得自己的地址
    const fromAddress = web3.eth.accounts.privateKeyToAccount(priKey.toString('hex')).address;

    // 要交换的tokenadrress
    const tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    // 获得代币有多少位小数
    const decimals = await tokenContract.methods.decimals().call();

    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    const los = 50;

    // 假设要购买0.005个BNB的tokenA
    const nbnbAmount = 0.005;

    // 在网站查询大概的bnb/token兑换比例
    const rate = 10000000000;
    const ntoken = nbnbAmount * (100 - los) / 100 * rate;

    const wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    const addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";

    // 创建交易执行智能合约
    const toAddress = addresspancake
    // 获得下一次交易的数
    const nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    // 交易需要0.005个BNB
    const nbnb = web3.utils.toWei((nbnbAmount).toString(), 'ether');
    // 设置gasprice 为 5G wei
    const gasPrice = web3.utils.toWei((5).toString(), 'Gwei');
    // 设置 gaslimit 为 420000
    const gaslimit = 420000
    // 获得input 内容
    const input = swaptokeninput({
        wbnbaddress,
        toaddress: fromAddress,
        tokenamountIn: Number(nbnb),
        tokenAmountOut: Number(ntoken),
        tokenaddress,
        tokendecimals: decimals
    })
    const result = await signTransaction({
        fromAddress,
        toAddress,
        input,
        nonceNum: nonceCnt,
        privKey: priKey,
        gasPrice,
        amount: nbnb,
        gaslimit
    })
    if (result) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}

// swap token to bnb
const swapTokensToBnb = async () => {
    // 获得自己的地址
    const reciever = web3.eth.accounts.privateKeyToAccount(priKey.toString('hex')).address;

    // 要交换的tokenadrress
    const tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    // 获得代币有多少位小数
    const decimals = await tokenContract.methods.decimals().call();

    const los = 50

    // 假设要出售10000000个tokenA
    const tokenToSell = 10000000;

    // 在网站查询大概的bnb/token兑换比例
    const rate = 600000000000;

    const minRecieved = tokenToSell * (100 - los) * 0.01 / rate;

    const wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    const addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";

    // 创建交易执行智能合约
    const toAddress = addresspancake
    // 获得下一次交易的数
    const nonceCnt = await web3.eth.getTransactionCount(reciever);

    // 设置gasprice 为 5G wei
    const gasPrice = web3.utils.toWei((5).toString(), 'Gwei');
    // 设置 gaslimit 为 420000
    const gaslimit = 420000
    // 获得input 内容
    const input = tokensToEthInput({
        wbnbaddress,
        toaddress: reciever,
        tokenamountIn: Number(tokenToSell),
        tokenAmountOut: Number(minRecieved.toFixed(18)),
        tokenaddress,
        tokendecimals: decimals
    })
    const result = await signTransaction({
        fromAddress: reciever,
        toAddress,
        input,
        nonceNum: nonceCnt,
        privKey: priKey,
        gasPrice,
        amount: web3.utils.toWei((0).toString(), 'Gwei'),
        gaslimit
    })
    if (result) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}

const main = async () => {
    // 第一部分，获得bnb的的数量
    getBNBBalance(walletaddress);

    // 作业1：获取10个代币的数量
    const tokenMap = new Map<string, string>();
    tokenMap.set("ShieldEX", "0x1ef6a7e2c966fb7c5403efefde38338b1a95a084")
    tokenMap.set("Bwitter Token", "0x8d32605b25921b548eefccdabc11e46543597aa7")
    tokenMap.set("Pink Token", "0x9133049fb1fddc110c92bf5b7df635abb70c89dc")
    tokenMap.set("Sdogenft Protocol", "0xb066b6cf3f956f75984dd49f4a3a9a80a1173195")
    tokenMap.set("satellite Doge-1", "0x5da2acb66671a3bd12e67bf200725f7f35bc7867")
    tokenMap.set("dick coin", "0x1e4ead1cc0604c1bb1bbe6aaeee2be563c4c95ae")
    tokenMap.set("RichWife Token", "0x6ed64908c9d6bda740ec0d2f01dc7bebe63c03e7")
    tokenMap.set("Godzilla", "0xef2d6c03293cd025639e9e2aba1a407e2b0e00f1")
    tokenMap.set("ShibaDrop.io", "0xab57aef3601cad382aa499a6ae2018a69aad9cf0")
    tokenMap.set("MAX", "0xddd02eb2183f8cd877d85515451cab0da6570ff4")
    tokenMap.forEach((value) => {
        getTokenBalance(value, walletaddress);
    })

    // 第二部分，获得代币的数量
    getTokenBalance(wbnbaddress, walletaddress);

    // 作业2：在源代码的基础上，调用代币的transfor功能转移代币（比如WBNB）
    transferERC20()

    // 第三部分，发送bnb
    send();

    // 第四部分，pancake bnb 交换某个代币
    swap()

    // 作业3: 实现pancake的swap功能
    swapTokensToBnb()
}

// 启动程序
main()