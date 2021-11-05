var Web3 = require('web3');

var rpcstring = 'https://bsc-dataseed1.binance.org/';
var wstring = 'wss://bsc-ws-node.nariox.org:443';

var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring));

var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring));

//用私钥将交易内容签名
var EthereumTx = require('ethereumjs-tx');
const util = require('ethereumjs-util');

var privKeystring = "c98ec428bd837599deeabc008554d6ee87b839710c97fc172f8e847782712c53";
var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

var walletaddress = "0x470906BD12811F128B4CC3FB93883BBF95bf5058";
var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
var tokenaddress = "0x4fabb145d64652a948d72533023f6e7a623c7c53";
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

const getBNBBalance = async (address) => {
  let result = await web3.eth.getBalance(address)
  let balance = web3.utils.fromWei(result.toString(10), getweiname());
  console.log("地址：" + address + "有" + balance + "个BNB");
  return balance;
}

const erc20 = require('./erc20.js')

//作业1
let addressArray = [
  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
  "0x8850d2c68c632e3b258e612abaa8fada7e6958e5", "0xde3dbbe30cfa9f437b293294d1fd64b26045c71a",
  "0x8e3bcc334657560253b83f08331d85267316e08a", "0x8f0528ce5ef7b51152a59745befdd91d97091d2f",
  "0x75231f58b43240c9718dd58b4967c5114342a86c", "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b"
]

function getArrrayTokenInformation(addressArray, address) {
  addressArray.forEach(element => {
    getTokenBalance(element, address)
  });
}

const getTokenBalance = async (tokenaddress, address) => {
  //创建代币的智能合约函数
  var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

  //调用代币的智能合约获取余额功能
  let result = await tokenContract.methods.balanceOf(address).call();
  //获得代币有多少位小数
  let decimals = await tokenContract.methods.decimals().call();
  weiname = getweiname(decimals);
  let tokenbalance = web3.utils.fromWei(result.toString(10), weiname);
  //获得代币符号
  let symbol = await tokenContract.methods.symbol().call();
  //打印结果
  console.log("地址：" + address + "有" + symbol + "的数量是：" + tokenbalance);
  return tokenbalance;
}



function getprivKey(privKeystring) {
  const privKey = new Buffer.from(privKeystring, "hex");
  return privKey;
}

var privKey = getprivKey(privKeystring);

//这里是将交易用私钥签名部分
function getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) {
  var rawTransaction = {
    "from": fromAddress,
    "nonce": web3.utils.toHex(nonceNum),
    "gaslimit": web3.utils.toHex(gaslimit),
    "gasPrice": web3.utils.toHex(gasPrice),
    "to": toAddress,
    "value": web3.utils.toHex(nbnb),
    "data": input,
    "chainId": 0x38
  }

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
  var fromAddress = "0x" + util.privateToAddress(privKey).toString('hex');

  //发送给谁
  var toAddress = walletaddress

  var nsendBNB = 0.002
  //假设交易 0.008个bnb
  var nbnb = web3.utils.toWei((nsendBNB).toString(10), 'ether');
  //设置gasprice 为 5G wei
  var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
  //设置 gaslimit 为 420000
  var gaslimit = 420000
  //没有调用智能合约，将input设置为空
  var input = ""
  //获得下一次交易的数
  var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
  console.log("gasPrice" + gasPrice)
  let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, privKey, gasPrice, nbnb, gaslimit)
  if (reslut) {
    console.log("交易成功")
  } else {
    console.log("交易失败")
  }

}

const transfor = async (tokenaddress, walletaddress, tokenNum) => {
  var fromAddress = "0x" + util.privateToAddress(privKey).toString('hex');
  var toAddress = walletaddress;
  //设置gasprice 为 10G wei
  var gasPrice = web3.utils.toWei((10).toString(10), 'Gwei');
  //设置 gaslimit 为 420000
  var gaslimit = 420000
  var nonceCnt = await web3.eth.getTransactionCount(fromAddress);
  var tokenContract = new web3.eth.Contract(erc20, tokenaddress);
  var input = tokenContract.methods.transfer(toAddress, web3.utils.toWei((tokenNum).toString(10), 'ether')).encodeABI();
  let reslut = await signTransaction(fromAddress, tokenaddress, input, nonceCnt, privKey, gasPrice, 0, gaslimit)
  if (reslut) {
    console.log("交易成功")
  } else {
    console.log("交易失败")
  }
}

const pancake = require('./pancake.js')


var moment = require('moment');

//获取input内容
function swaptokeninput(wbnbadddress, toaddress, tokenamountIn, amountOut, tokenaddress, tokendecimals = 18, ) {

  weiname = getweiname(tokendecimals);

  var path = [wbnbadddress, tokenaddress];

  var amountOutMin = web3.utils.toWei(amountOut.toString(10), weiname);
  const now = moment().unix();
  const DEADLINE = now + 60 * 20; //往后延迟20分钟

  var deadline = (DEADLINE).toString(10);
  console.log("inputbefore");
  console.log(pancake[0]);
  var input = web3.eth.abi.encodeFunctionCall(pancake[0], [amountOutMin, path, toaddress, deadline]);
  console.log(input)
  return input;
}
var moment = require('moment');
const swap = async () => {

  //获得自己的地址
  var fromAddress = "0x" + util.privateToAddress(privKey).toString('hex');
  //要交换的tokenadrress

  var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

  //获得代币有多少位小数
  let decimals = await tokenContract.methods.decimals().call();

  // 设置交易滑点,直接调用合约可以设置100的滑点，这里设置50的滑点
  var los = 99;
  // 假设要购买0.005个BNB的tokenA
  var nbnb = 0.01;
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

  var input = swaptokeninput(wbnbaddress, fromAddress, nbnb, ntoken, tokenaddress, decimals)
  let reslut = await signTransaction(fromAddress, toAddress, input, nonceCnt, privKey, gasPrice, nbnb, gaslimit)
  if (reslut) {
    console.log("交易成功")
  } else {
    console.log("交易失败")
  }

}

const main = async () => {
  // getBNBBalance(walletaddress);
  // getTokenBalance(wbnbaddress, walletaddress);
  // send();
  // swap()
  
  //作业1
  // getArrrayTokenInformation(addressArray, walletaddress)
  //作业2
  // transfor(wbnbaddress, walletaddress, 0.0002)
}

main();