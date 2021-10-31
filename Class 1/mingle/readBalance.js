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

const commonUtils = require('./commonUtils.js');

var myAddress= "0x088a8384bdC4Ec8702415b9fA838Dff3FD805bFC"
var lqtAddress = "0xbd2c43da85d007b0b3cd856fd55c299578d832bc"
var dndAddress = "0x14c358b573a4ce45364a3dbd84bbb4dae87af034"
var jojoAddress = "0x30938fd95ee9ec20e1c0344520e098ec6c3991d6"
var dytAddress = "0x740623d2c797b7d8d1ecb98e9b4afcf99ec31e14"
var doggyAddress = "0x74926b3d118a63f6958922d3dc05eb9c6e6e00c6"
var cnsAddress = "0xf6cb4ad242bab681effc5de40f7c8ff921a12d63"
var tlmAddress = "0x2222227e22102fe3322098e4cbfe18cfebd57c95"
var phyAddress = "0xae63595ed0bcfddeff2ebb74a20ae96727783a67"
var gbyteAddress = "0xeb34de0c4b2955ce0ff1526cdf735c9e6d249d09"
var tmfAddress = "0x7122f1c0777900b959573132deac9a7209741aa0"
const main = async () => {
    
    let balance1 = await commonUtils.getTokenBalance(lqtAddress,myAddress)
    let balance2 = await commonUtils.getTokenBalance(dndAddress,myAddress)
    let balance3 = await commonUtils.getTokenBalance(jojoAddress,myAddress)
    let balance4 = await commonUtils.getTokenBalance(dytAddress,myAddress)
    let balance5 = await commonUtils.getTokenBalance(doggyAddress,myAddress)
    let balance6 = await commonUtils.getTokenBalance(cnsAddress,myAddress)
    let balance7 = await commonUtils.getTokenBalance(tlmAddress,myAddress)
    let balance8 = await commonUtils.getTokenBalance(phyAddress,myAddress)
    let balance9 = await commonUtils.getTokenBalance(gbyteAddress,myAddress)
    let balance10 = await commonUtils.getTokenBalance(tmfAddress,myAddress)

}

main()