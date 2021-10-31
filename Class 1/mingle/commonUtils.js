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
//因为是通过网络查询，所以要使用 async模式才能查询，不适用 async 不会使用阻塞模式
const getBNBBalance= async (address) =>
{
    let result = await web3.eth.getBalance(address)
    //由于使用的是大数模式，小数点有18位，所以获得的balance 要除以10^18次方才是正确的数据
    //或者使用自带的转换工具
    let balance = web3.utils.fromWei(result.toString(10), getweiname());
    //打印结果
    console.log("地址:" + address +"有" + balance +"个BNB");
    return balance;
}


var EthereumTx =  require('ethereumjs-tx')

//调用获取BNB余额
getBNBBalance("0x088a8384bdC4Ec8702415b9fA838Dff3FD805bFC");

//使用该函数之前需要应用 erc20 的 abi接口

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

//将erc20 取出来
const erc20 = require('./erc20.js')

//获得代币数量
const getTokenBalance = async (tokenaddress,address) =>
{
    //创建代币的智能合约函数
    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);
  
    //调用代币的智能合约获取余额功能
    let result= await tokenContract.methods.balanceOf(address).call();
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    weiname = getweiname(decimals);
    let tokenbalance =  web3.utils.fromWei(result.toString(10), weiname);

    //获得代币的符号
    let symbol = await tokenContract.methods.symbol().call();

    //打印结果
    console.log("地址:" +address +"有代币:" +symbol +"的数量是:"+tokenbalance);
    return tokenbalance;
}


var walletaddress= "0x088a8384bdC4Ec8702415b9fA838Dff3FD805bFC"
var lqtLPAddress= "0x0a0c9448De5eD90dCbC56ea0f11E9337c2b3Dc1E"
var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
var lqtwallet = "0xbd2c43da85d007b0b3cd856fd55c299578d832bc"
//getTokenBalance(wbnbaddress ,walletaddress);
//getTokenBalance(lqtwallet ,walletaddress);
const main = async () => {
    //要使用哪部分，就去掉哪部分的注释
    //第一部分，获得bnb的的数量
    getBNBBalance(walletaddress);
    //第二部分，获得代币的数量
    getTokenBalance(wbnbaddress, walletaddress);
    getTokenBalance(lqtwallet ,walletaddress);

    //第三部分，发送bnb
   // send();
    //第四部分，pancake bnb 交换某个代币
    //swap()
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

module.exports = {getBNBBalance,getTokenBalance,getweiname,signTransaction,getEthRawTx}

//启动程序

