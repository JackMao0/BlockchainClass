var Web3 = require('web3');
var EthereumTx = require('ethereumjs-tx').Transaction;
const util = require('ethereumjs-util')
const ethereumjs_common = require ('ethereumjs-common').default;

var BSC_MAIN = ethereumjs_common.forCustomChain ('mainnet', { networkId: 56, chainId: 56, name: 'bnb' }, 'petersburg');


//创建 rpc 连接字符串
var rpcstring = 'https://bsc-dataseed1.binance.org/'
//创建ws连接字符串
var wstring = 'wss://bsc-ws-node.nariox.org:443';
var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring));
var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring));
var web3 = rpcweb3;

function getPriKey(prikeystring) {
    const privKey =Buffer.from(prikeystring, "hex");
    return privKey;
}

//这里是将交易用私钥签名部分
function getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) {

    var rawTransaction = {
        from: fromAddress,
        nonce: web3.utils.toHex(nonceNum),
        gasLimit: web3.utils.toHex(gaslimit),
        gasPrice: web3.utils.toHex(gasPrice),
        to: toAddress,
        value: web3.utils.toHex(nbnb),
        data: web3.utils.toHex(input),
    };
    const tx = new EthereumTx(rawTransaction,{common: BSC_MAIN});
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    return serializedTx;
}

//将签名的内容发送到区块链网络中
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

const sendtx = async (prikeystring,contractaddress,value,input) => {
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    value = web3.utils.toWei((value).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000
    console.log("从该地址发送：" + fromAddress)
    //获得下一次交易的数
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    let result = await signTransaction(fromAddress, contractaddress, input, nonceCnt, priKey, gasPrice, value, gaslimit)
    if (result) {
        console.log("发送成功")
    }
    else {
        console.log("发送失败")
    }
}

const pancakeabi = require('./pancakeabi.js')
const moment = require("moment");
function swapETHForExactTokensinput(abi,bnbnum,tokenaddress,initialrate,slippage,delaymin,accountaddress){
    var wbnbadddress="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    var path = [wbnbadddress,tokenaddress];
    var amountOut= (bnbnum*(100 - slippage) / 100 * initialrate).toFixed(12);
    var amountOutMin = web3.utils.toWei(amountOut.toString(10), "ether");
    var moment = require('moment');
    const now = moment().unix();
    const DEADLINE = now + 60 * delaymin;
    var deadline = (DEADLINE).toString(10);
    var input = web3.eth.abi.encodeFunctionCall(abi[17],[amountOutMin,path,accountaddress,deadline]);
    return input;
}

function approvetokeninput(contractaddress,num){
    const approve=require('./approve.js')
    approvenum = web3.utils.toWei(num.toString(10), "ether");
    var input = web3.eth.abi.encodeFunctionCall(approve[0],[contractaddress,approvenum]);
    return input;
}

function approvetoken(prikeystring,tokencontractaddress,num,contractyouwanttoapprove){
    sendtx(prikeystring,tokencontractaddress,0,approvetokeninput(contractyouwanttoapprove,num))
}

function swapETHForExactTokens(prikeystring,routeraddress,abi,bnbnum,tokenaddress,initialrate,slippage,delaymin,toaddress){
    const input=swapETHForExactTokensinput(abi,bnbnum,tokenaddress,initialrate,slippage,delaymin,toaddress)
    sendtx(prikeystring,routeraddress,bnbnum,input)
}

function swapExactTokensForTokensinput(abi,tokenAnum,tokenA_address,tokenB_address,initialrate,slippage,delaymin,accountaddress){
    var amountIn=web3.utils.toWei(tokenAnum.toString(10), "ether");
    var amountOut=(tokenAnum*(100 - slippage) / 100 * initialrate).toFixed(12);
    var amountOutMin = web3.utils.toWei(amountOut.toString(10), "ether");
    var path = [tokenA_address,tokenB_address];
    var moment = require('moment');
    const now = moment().unix();
    const DEADLINE = now + 60 * delaymin;
    var deadline = (DEADLINE).toString(10);
    var input = web3.eth.abi.encodeFunctionCall(abi[21],[amountIn,amountOutMin,path,accountaddress,deadline]);
    return input;
}

function swapExactTokensForTokens(prikeystring,routeraddress,abi,tokenAnum,tokenA_address,tokenB_address,initialrate,slippage,delaymin,toaddress){
    sendtx(prikeystring,routeraddress,0,swapExactTokensForTokensinput(abi,tokenAnum,tokenA_address,tokenB_address,initialrate,slippage,delaymin,toaddress))
}

var prikeystring="";
var toAddress="0x0000158a8A7419a291187d20e47f748a5eA1824C";
var atomaddress="0x0eb3a705fc54725037cc9e008bdede697f62f335";
var pancakerouter="0x10ed43c718714eb63d5aa57b78b54704e256024e";
var wbnbaddress="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";


swapETHForExactTokens(prikeystring,pancakerouter,pancakeabi,0.0001,atomaddress,14.39,1,10,toAddress)
approvetoken(prikeystring,atomaddress,1,pancakerouter)
swapExactTokensForTokens(prikeystring,pancakerouter, pancakeabi,0.002,atomaddress,wbnbaddress,0.0691,1,10,toAddress)