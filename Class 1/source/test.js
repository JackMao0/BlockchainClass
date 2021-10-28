//这里用bsc 链举例子
//加载web3的库
var Web3 = require('web3');

//创建 rpc 连接字符串
var rpcstring = 'https://bsc-dataseed1.binance.org/'
//创建ws连接字符串
var wstring = 'wss://bsc-ws-node.nariox.org:443';

// wbnb地址
var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"

//第三部分的收款地址
var walletaddress = ""

//第三，四部分要用到的私钥
var prikeystring = ""; //这里填自己的私钥

//第四部分，要交换哪个代币的地址
var tokenaddress = "0x7ceb519718a80dd78a8545ad8e7f401de4f2faa7";//自己设置要交换的tokenaddress

var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring));
var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring));

//设置web3 使用rpcweb3模式
web3 = rpcweb3;

//通过小数点多少位，转换对应的数据
function getweiname(tokendecimals = 18) {
    weiname = 'ether';
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
            weiname = 'microether ';
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


//因为是通过网络查询，所以要使用 async模式才能查询，不适用 async 不会使用阻塞模式
const getBNBBalance = async (address) => {
    let result = await web3.eth.getBalance(address)
    //由于使用的是大数模式，小数点有18位，所以获得的balance 要除以10^18次方才是正确的数据
    //或者使用自带的转换工具
    let balance = web3.utils.fromWei(result.toString(10), getweiname());
    //打印结果
    console.log("地址:" + address + "有" + balance + "个BNB");
    return balance;
}




//使用该函数之前需要应用 erc20 的 abi接口

//将erc20 取出来
const erc20 = require('./erc20.js')

//获得代币数量
const getTokenBalance = async (tokenaddress, address) => {
    //创建代币的智能合约函数
    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    //调用代币的智能合约获取余额功能
    let result = await tokenContract.methods.balanceOf(address).call();
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    weiname = getweiname(decimals);
    let tokenbalance = web3.utils.fromWei(result.toString(10), weiname);

    //获得代币的符号
    let symbol = await tokenContract.methods.symbol().call();

    //打印结果
    console.log("地址:" + address + "有代币:" + symbol + "的数量是:" + tokenbalance);
    return tokenbalance;
}









//用私钥将交易内容签名
var EthereumTx = require('ethereumjs-tx');
const util = require('ethereumjs-util')
//这里是加载私钥的部分


prikeystring = prikeystring.replace("0x", "")
function getPriKey(prikeystring) {

    const privKey = new Buffer.from(prikeystring, "hex");
    return privKey;
}

//这里的privKey 是私钥
var priKey = getPriKey(prikeystring);

//这里是将交易用私钥签名部分
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


//这里是将签名的内容发送到区块链网络中的代码
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



const send = async () => {
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');

    //发送给谁
    var toAddress = walletaddress

    var nsendBNB = 0.008
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



const pancake = require('./pancake.js')

//获取input内容
function swaptokeninput(wbnbadddress, toaddress, tokenamountIn, amountOut, tokenaddress, tokendecimals = 18,) {

    weiname = getweiname(tokendecimals);
    
    var path = [ wbnbadddress,tokenaddress];

    var amountOutMin = web3.utils.toWei(amountOut.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now + 60 * 20; //往后延迟20分钟

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    console.log(pancake[0]);
    var input = web3.eth.abi.encodeFunctionCall(pancake[0], [ amountOutMin, path, toaddress, deadline]);
    console.log(input)
    return input;
}
var moment = require('moment');
const swap = async () => {

    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    //要交换的tokenadrress

    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();

    // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
    var los = 50;
    // 假设要购买5个BNB的tokenA
    var nbnb = 0.005;
    //假设bnb 和 token的兑换比例是 1:1000
    var rate = 57;
    var ntoken = nbnb * (100 - los) / 100 * rate;

    var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
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

    var input = swaptokeninput(wbnbaddress, fromAddress, nbnb, ntoken, tokenaddress, decimals)
    let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, nbnb, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }

}

const main = async () => {
    //第一部分，获得bnb的的数量
    //getBNBBalance(walletaddress);
    //第二部分，获得代币的数量
   // getTokenBalance(wbnbaddress, walletaddress);
    //第三部分，发送bnb
   // send();
    //第四部分，pancake bnb 交换某个代币
    swap()
}

//启动程序
main()