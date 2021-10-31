var Web3 = require('web3');

//创建 rpc 连接字符串
var rpcstring = 'https://bsc-dataseed1.binance.org/'
//创建ws连接字符串
var wstring = 'wss://bsc-ws-node.nariox.org:443';
var wscweb3 = new Web3(new Web3.providers.WebsocketProvider(wstring));
var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring));
web3 = rpcweb3;
var address="0x512aaD1d0E1492a9C4075aBa58cE1a944A74f973"

const getBNBBalance = async (address) => {
    let result = await web3.eth.getBalance(address)
    let balance=web3.utils.fromWei(result.toString(),"ether")
    console.log("地址" + address + "有" + balance + "个BNB");
    return balance;
}

const erc20 = require('./erc20.js')
const getTokenBalance = async (tokenaddress, address) => {
    //创建代币的智能合约函数
    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    //调用代币的智能合约获取余额功能
    let result = await tokenContract.methods.balanceOf(address).call();
    //获得代币有多少位小数
    let decimals = await tokenContract.methods.decimals().call();
    let tokenbalance = web3.utils.fromWei(result.toString(10), "ether");

    //获得代币的符号
    let symbol = await tokenContract.methods.symbol().call();

    //打印结果
    console.log("地址" + address + "代币:" + symbol + "的数量是:" + tokenbalance);
    return tokenbalance;
}

getBNBBalance(address);
var tentokenaddress=new Array("0x0eb3a705fc54725037cc9e008bdede697f62f335","0xd2ff8c018a22ff06f4be781090579d0490b9a69f","0x9e3a9F1612028eeE48F85cA85f8Bed2f37d76848","0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xc66e4de0d9b4f3cb3f271c37991fe62f154471eb","0x3fcca8648651e5b974dd6d3e50f61567779772a8","0xb16600c510b0f323dee2cb212924d90e58864421","0x5ece3f1542c4e1a06767457e4d8286bea772fc41","0x5190b01965b6e3d786706fd4a999978626c19880","0xc409ec8a33f31437ed753c82eed3c5f16d6d7e22");

for(let i in tentokenaddress){
    getTokenBalance(tentokenaddress[i],address);
}

