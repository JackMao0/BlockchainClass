var contract_mutual = require('./contract_mutual.js');
var erc20 = require('./erc20');
var Web3 = require('web3');
async function readBalance(mainNetName,tokenContractAddress,accountAddress) {
    var web3 = new Object();
    if(mainNetName=="BSC"){
        web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org/"));
    }else if(mainNetName=="Matic"){
        web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mainnet.maticvigil.com/"));
    }else if(mainNetName=="Fantom"){
        web3 = new Web3(new Web3.providers.HttpProvider("https://rpcapi.fantom.network"));
    }else {
        console.log("无该主链的实现或者主链输入不对");
        return "";
    }
    var getToken = await contract_mutual.getTokenBalance(tokenContractAddress, accountAddress,web3);
}

const main = async ()=>{
    var mainNetName = "Fantom";
    var tokenContractAddress = "";
    var accountAddress = "";
    readBalance(mainNetName,tokenContractAddress,accountAddress)
}
main()