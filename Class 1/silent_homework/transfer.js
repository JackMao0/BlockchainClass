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



const sendbnb = async (prikeystring,toAddress,nsendBNB) => {
    var priKey = getPriKey(prikeystring);
    //获得自己的地址
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    var nbnb = web3.utils.toWei((nsendBNB).toString(10), 'ether');
    //设置gasprice 为 5G wei
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    //设置 gaslimit 为 420000
    var gaslimit = 420000
    //没有调用智能合约，将input设置为空
    var input = ""
    //获得下一次交易的数
    console.log("从该地址发送：" + fromAddress)
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
    let result = await signTransaction(fromAddress, toAddress, input, nonceCnt, priKey, gasPrice, nbnb, gaslimit)
   if (result) {
        console.log("发送成功")
    }
    else {
        console.log("发送失败")
    }
}
const transferabi=require('./transferabi.js')

function transfertokeninput (num,toaddress){
    var weinum= web3.utils.toWei(num.toString(), "ether");
    var input = web3.eth.abi.encodeFunctionCall(transferabi[0],[toaddress,weinum]);
    return input;
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
function sendcustomtoken(prikeystring,tokencontractaddress,num,toAddress){
    sendtx(prikeystring,tokencontractaddress,0,transfertokeninput(num,toAddress));
}
var prikeystring="";
var toAddress="0x512aaD1d0E1492a9C4075aBa58cE1a944A74f973";
var wbnbAddress="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
sendbnb(prikeystring,toAddress,0.001);
sendcustomtoken(prikeystring,wbnbAddress,0.01,toAddress)
