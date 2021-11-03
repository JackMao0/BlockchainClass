var common_tool = require('./common_tool.js')
const abis = require('./abis.js');
var Web3 = require('web3');
var rpc_str = "https://bsc-dataseed.binance.org/";
var rpc_web3 = new Web3(new Web3.providers.HttpProvider(rpc_str));
web3 = rpc_web3

//1.读取账户bnb个数
const getBNBBalance = async (address) => {
    let result = await web3.eth.getBalance(address)
    //由于使用的是大数模式，小数点有18位，所以获得的balance 要除以10^18次方才是正确的数据
    //或者使用自带的转换工具
    let balance = web3.utils.fromWei(result.toString(10), common_tool.getweiname());
    //打印结果
    console.log("地址:" + address + "有" + balance + "个BNB");
    return balance;
}

//2.获得代币数量
const getTokenBalance = async (tokenaddress, address) => {
    //创建代币的智能合约函数
    var tokenContract = new web3.eth.Contract(abis.erc20, tokenaddress);

    //调用代币的智能合约获取余额功能
    let result = await tokenContract.methods.balanceOf(address).call();
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    var weiname = common_tool.getweiname(decimals);
    let tokenbalance = web3.utils.fromWei(result.toString(10), weiname);

    //获得代币的符号
    let symbol = await tokenContract.methods.symbol().call();

    //打印结果
    console.log("地址:" + address + " 有代币:" + symbol + "的数量是:" + tokenbalance);
    //return tokenbalance
    return [address,symbol,tokenbalance]
}


//3.获取tokentotoken的rate
const  getTokenToTokenRate = async (tokenToTokenAddress,tokenAddress,wbnbaddress)=>{
    //隐身，bnb和某个代币在pancake 上的交换比
    //安全月的 交易对地址: 0x9adc6fb78cefa07e13e9294f150c1e8c1dd566c0
    // 安全月的合约地址: 0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3
    //获得 交易对的上safemoon 的数量

    var safemoonpair = tokenToTokenAddress //"0x9adc6fb78cefa07e13e9294f150c1e8c1dd566c0"
    var safemoonaddress = tokenAddress //"0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3"
    let safemoon = await getTokenBalance(safemoonaddress, safemoonpair);
    let wbnb = await getTokenBalance(wbnbaddress, safemoonpair);
    let safemoonnum = safemoon[2];
    let wbnbnum = wbnb[2];
    let ps =   safemoonnum/wbnbnum;

    let bili = ps.toFixed(2);
    console.log("1"+wbnb[1]+ "可以交换多少个"+safemoon[1]+":"+bili)
    return bili;
}

//
//swap系列
//1.用私钥将交易内容签名
var EthereumTx = require('ethereumjs-tx');
const util = require('ethereumjs-util')
var moment = require('moment');
//2.获取input内容
function swapEthToTokensInput(wbnbadddress, toaddress, tokenamountIn, amountOut, tokenaddress, tokendecimals = 18,) {

    weiname = common_tool.getweiname(tokendecimals);

    var path = [ wbnbadddress,tokenaddress];

    var amountOutMin = web3.utils.toWei(amountOut.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; //往后延迟20分钟

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    var input_type =  {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapETHForExactTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }
    console.log(input_type);
    var input = web3.eth.abi.encodeFunctionCall(input_type, [ amountOutMin, path, toaddress, deadline]);
    console.log(input)
    return input;
}
function swapTokensToEthInput(payContractAddress, fromAddress, payNum, getNum, getContractAddress, decimals = 18,) {

    var weiname = common_tool.getweiname(decimals);

    var path = [ payContractAddress,getContractAddress];
    var amountIn = web3.utils.toWei(payNum.toString(10), weiname);
    var amountOutMin = web3.utils.toWei(getNum.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; //往后延迟20分钟

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    var input_type =  {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    console.log(input_type);
    var input = web3.eth.abi.encodeFunctionCall(input_type, [amountIn, amountOutMin, path, fromAddress, deadline]);
    console.log(input)
    return input;
}

// 3.swap系列相关方法
function getPriKey(prikeystring) {

    const privKey = new Buffer.from(prikeystring, "hex");
    return privKey;
}

//4.这里是将签名的内容发送到区块链网络中的代码
const signTransaction = async (fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) => {
    var serializedTx = getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit)

    // Comment out these three lines if you don't really want to send the TX right now
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
    if (receipt.status == true) {
        return true;
    }
    return false;
}
//5.这里是将交易用私钥签名部分
function getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) {

    var rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(gaslimit),
        "gasPrice": web3.utils.toHex(gasPrice),
        "to": toAddress,
        "value": web3.utils.toHex(nbnb),
        "data": input,  //设置num属性
        "chainId": 0x38 //4:Rinkeby, 3:Ropsten, 1:mainnet
    };

    var tx = new EthereumTx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    return serializedTx;
}
// swap系列相关方法最后的方法
const swapEthToTokens = async (prikeystring,tokenaddress,wbnbaddress,addresspancake) => {
    prikeystring = prikeystring.replace("0x", "")
    //这里的privKey 是私钥
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');

    //要交换的tokenadrress
    var tokenContract = new web3.eth.Contract(abis.erc20, tokenaddress);
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    var los = 50;
    // 假设要购买5个BNB的tokenA
    var nbnb = 0.005;
    //假设bnb 和 token的兑换比例是 1:1000
    var rate = 57;
    var ntoken = nbnb * (100 - los) / 100 * rate;


    //获得input 内容
    //创建交易执行智能合约
    var toAddress = addresspancake
    //获得下一次交易的数
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    //交易需要5个BNB
    nbnb = web3.utils.toWei((nbnb).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000
    var input = swapEthToTokensInput(wbnbaddress, fromAddress, nbnb, ntoken, tokenaddress, decimals)
    let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, nbnb, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}
// swap系列相关方法最后的方法
const swapTokensToEth = async (priKey,payContractAddress,getContractAddress,pancakeAddress) => {
    var prikeystring = priKey.replace("0x", "")
    //这里的privKey 是私钥
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');

    //要交换的tokenadrress
    var tokenContract = new web3.eth.Contract(abis.erc20, getContractAddress);
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    var los = 50;
    // 假设要购买5个BNB的tokenA
    var payNum = 0.005;
    //假设bnb 和 token的兑换比例是 1:1000
    var rate = 57;
    var getNum = payNum * (100 - los) / 100 * rate;

    //获得input 内容
    //创建交易执行智能合约
    var toAddress = pancakeAddress
    //获得下一次交易的数
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    //交易需要5个BNB
    var payNum = web3.utils.toWei((payNum).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000
    var input = swapTokensToEthInput(payContractAddress, fromAddress, payNum, getNum, getContractAddress, decimals)
    let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, 0, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}
const tokenToToken = async(parameter_map)=>{

    var prikeystring = parameter_map['prikeystring']
    var adatokenaddress = parameter_map['adatokenaddress']
    var wbnbaddress = parameter_map['wbnbaddress']
    var atomtokenaddress = parameter_map['atomtokenaddress']
    var pancakeaddress = parameter_map['pancakeaddress']

    prikeystring = prikeystring.replace("0x", "")
    //这里的privKey 是私钥
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    //要交换的tokenadrress
    var tokenContract = new web3.eth.Contract(abis.erc20, atomtokenaddress);
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    //2.计算滑点
    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    var los = parameter_map['los'];
    // 原币数量
    var pay_token_num = parameter_map['pay_token_num'];
    //兑换比率
    var tokenToTokenRate = parameter_map['tokenToTokenRate']
    // 获取的兑换币个数
    var get_token_num =  (pay_token_num* (100 - los) / 100 * tokenToTokenRate).toFixed(12);
    var pancakeFun = parameter_map['pancakeFun']

    //获得下一次交易的数
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);

    //交易需要多少个原币：换算成区块链认识的整数
    pay_token_num = web3.utils.toWei((pay_token_num).toString(10), 'ether');

    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000

    //获取交易用的input
    //var input = swaptokeninput(wbnbaddress, fromAddress, source_token_num, get_token_num, tokenaddress, decimals)
    var weiname = common_tool.getweiname(parseInt(decimals));

    var path = [adatokenaddress,wbnbaddress,atomtokenaddress];

    var amountOutMin = web3.utils.toWei(get_token_num.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; //往后延迟20分钟

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    var input_type =  {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    console.log(input_type);
    var input = web3.eth.abi.encodeFunctionCall(input_type, [pay_token_num, amountOutMin, path, fromAddress, deadline]);
    console.log(input)
    //let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, 0, gaslimit)
    let reslut = await signTransaction(fromAddress, pancakeaddress, input, nonceCnt, priKey, gasPrice, 0, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }
}


const send = async (prikeystr,toAddress) => {
    var prikeystring = prikeystr.replace("0x", "")
    //这里的privKey 是私钥
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');

    //发送给谁
    var toAddress = toAddress

    var nsendBNB = 0.0015
    //假设交易 0.008个bnb
    var nbnb = web3.utils.toWei((nsendBNB).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000
    //没有调用智能合约，将input设置为空
    var input = ""
    //获得下一次交易的数
    console.log("发送地址是：" + fromAddress)
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, nbnb, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}

const transferByAbi = async (prikeystr,payContractAddress,getAccountAddress,payNum) => {
    var prikeystring = prikeystr.replace("0x", "")
    //这里的privKey 是私钥
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    //需要支付的币数量
    var amountInNum = web3.utils.toWei((payNum).toString(10), 'ether');
    var abiFunctionMap = {
        "constant": false,
        "inputs": [
            {
                "name": "dst",
                "type": "address"
            },
            {
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
    //获取input
    var input = web3.eth.abi.encodeFunctionCall(abiFunctionMap,[getAccountAddress,amountInNum]);

    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000

    //获得下一次交易的数
    console.log("发送地址是：" + fromAddress)
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    let reslut = await signTransaction(fromAddress, payContractAddress, input, nonceCnt, priKey, gasPrice, 0, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }
}

module.exports = {
    "getBNBBalance":getBNBBalance,
    "getTokenBalance":getTokenBalance,
    "getTokenToTokenRate":getTokenToTokenRate,
    "swapEthToTokens":swapEthToTokens,
    "swapTokensToEth":swapTokensToEth,
    "tokenToToken":tokenToToken,
    "send":send,
    "transferByAbi":transferByAbi
}