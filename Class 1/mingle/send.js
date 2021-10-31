//这里用bsc 链举例子
//加载web3的库
const { mainModule } = require('process');
var Web3 = require('web3');
//创建 rpc 连接字符串
var rpcstring = 'https://bsc-dataseed1.binance.org/'
//创建ws连接字符串
var wstring = 'wss://bsc-ws-node.nariox.org:443';

var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring ));
var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring ));

//设置web3 使用rpcweb3模式
web3 = rpcweb3;
var prikeystring = ""
var walletaddress= "0x088a8384bdC4Ec8702415b9fA838Dff3FD805bFC"
var toAddress = ""
var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
var lqtwallet = "0xbd2c43da85d007b0b3cd856fd55c299578d832bc"


var EthereumTx =  require('ethereumjs-tx')
//const EthereumTx = require('ethereumjs-tx').Transaction
const util = require('ethereumjs-util')
//这里是加载私钥的部分



prikeystring = prikeystring.replace("0x", "")

function getPriKey(prikeystring) {

    const privKey = new Buffer.from(prikeystring, "hex");
    return privKey;
}

//这里的privKey 是私钥
var priKey = getPriKey(prikeystring);


const send = async () => {
    //获得自己的地址
    //var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    var fromAddress = walletaddress
    //发送给谁
    var toAddress = walletaddress

    var nsendBNB = 0.0001
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

const main = async () => {
    //要使用哪部分，就去掉哪部分的注释
    //第一部分，获得bnb的的数量
    //getBNBBalance(walletaddress);
    //第二部分，获得代币的数量
    //getTokenBalance(wbnbaddress, walletaddress);
    //getTokenBalance(lqtwallet ,walletaddress);

    //第三部分，发送bnb
    send();
    //第四部分，pancake bnb 交换某个代币
    //swap()
}

main()