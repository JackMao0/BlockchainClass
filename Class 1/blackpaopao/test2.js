const { Address } = require('ethereumjs-util');
var Web3 =require('web3');

var rpcstring ='https://bsc-dataseed1.binance.org/'

var rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring ));
web3=rpcweb3;

function getweiname(tokendecimals = 18) {
    tokendecimals = Number(tokendecimals.toString())
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
        default:
            weiname = 'ether';
            break;

    }
    return weiname;
}
const getBNBBalance= async (address)=> {
    let result = await web3.eth.getBalance(address)
    console.log("原始区块链数据中存的BNB的数量是:" + result)
    let balance = web3.utils.fromWei(result.toString(10), getweiname());
    console.log("经过小数点转换之后的BNB数量是:" + balance)
    //打印结果
    console.log("地址:" + address + "有" + balance + "个BNB");
    return balance;


}
getBNBBalance("0x7f86C79c1D458B03c14e5a6C658100283a1c3cc1")

const erc20=require('./erc20.js')
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
    console.log("地址:这是我自己的" + address + "有代币:" + symbol + "的数量是:" + tokenbalance);
    return tokenbalance;
}
var wbnbaddress = "0x12bb890508c125661e03b09ec06e404bc9289040"
var walletaddress="0x7f86C79c1D458B03c14e5a6C658100283a1c3cc1"
getTokenBalance(wbnbaddress ,walletaddress);
