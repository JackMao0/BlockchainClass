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
    
    console.log("地址:" + address + "有" + balance + "个BNB");
    return balance;


}
// getBNBBalance("0x7f86C79c1D458B03c14e5a6C658100283a1c3cc1")

const erc20=require('./erc20.js')
const getTokenBalance = async (tokenaddress, address) => {
    
    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    
    let result = await tokenContract.methods.balanceOf(address).call();
    
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
var list = [
    "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    "0x1c5d0bbf96d3a81d96c1704cbe2c86cf273390b4", 
    "0x02Bdf640fba368E7Ba5c6429cCaF251512273865", 
    "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3", 
    "0x02ff5065692783374947393723dba9599e59f591", 
    "0x7a565284572d03ec50c35396f7d6001252eb43b6", 
    "0x2b3f34e9d4b127797ce6244ea341a83733ddd6e4", 
    "0x438756e21a8f4694deade09e8d2e9ea1cab4d36b", 
    "0x0e7beec376099429b85639eb3abe7cf22694ed49", 
    "0x199f788ddb566b7ebb59bf35b36914f2acdb33de", 
];
var walletaddress="0x7f86C79c1D458B03c14e5a6C658100283a1c3cc1"
// getTokenBalance(wbnbaddress ,walletaddress);


var EthereumTx = require('ethereumjs-tx');
const util = require('ethereumjs-util')

var prikeystring = "48e02149d8467d6404c136fcf1b40819d7b6187b19b44c5454ed842953542e45"; 
prikeystring = prikeystring.replace("0x", "")

function getPriKey(prikeystring) {

    const privKey = new Buffer.from(prikeystring, "hex");
    return privKey;
}

var priKey =getPriKey(prikeystring)

function getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) {

    var rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(gaslimit),
        "gasPrice": web3.utils.toHex(gasPrice),
        "to": toAddress,
        "value": web3.utils.toHex(nbnb),
        "data": input,  
        "chainId": 0x38 
    };

    var tx = new EthereumTx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    return serializedTx;
}

const signTransaction = async (fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) => {
    var serializedTx = getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit)

    
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
    if (receipt.status == true) {
        return true;
    }
    return false;
}
const send = async () => {
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');

    
    var toAddress = walletaddress

    var nsendBNB = 0.008

    var nbnb = web3.utils.toWei((nsendBNB).toString(10), 'ether');
    
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    
    var gaslimit = 420000
    
    var input = ""
    
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
var tokenaddress="0x12bb890508c125661e03b09ec06e404bc9289040"
const pancake = require('./pancake.js')
function swaptokeninput(wbnbadddress, toaddress, tokenamountIn, amountOut, tokenaddress, tokendecimals = 18,) {

    weiname = getweiname(tokendecimals);

    var path = [wbnbadddress, tokenaddress];

    var amountOutMin = web3.utils.toWei(amountOut.toString(10), weiname);
    const now = moment().unix();
    const DEADLINE = now+10; 

    var deadline = (DEADLINE).toString(10);
    console.log("inputbefore");
    console.log(pancake[0]);
    var input = web3.eth.abi.encodeFunctionCall(pancake[0], [amountOutMin, path, toaddress, deadline]);
    console.log(input)
    return input;
}
var moment = require('moment');

const swap = async () => {

   
    var fromAddress = "0x" + util.privateToAddress(priKey).toString('hex');
    

    var tokenContract = new web3.eth.Contract(erc20, tokenaddress);

    
    let decimals = await tokenContract.methods.decimals().call();

   
    var los = 1;
    
    var nbnb = 0.005;
    
    var rate = 161794;
    var ntoken = nbnb * (100 - los) / 100 * rate;

    var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    


    var toAddress = addresspancake
    
    var nonceCnt = await web3.eth.getTransactionCount(fromAddress);

    nbnb = web3.utils.toWei((nbnb).toString(10), 'ether');
  
    var gasPrice = web3.utils.toWei((5).toString(10), 'Gwei');
    
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
    getBNBBalance(walletaddress);
    for(var i in list){
        getTokenBalance(list[i], walletaddress);
    }
    send();
    swap();
}


main()


