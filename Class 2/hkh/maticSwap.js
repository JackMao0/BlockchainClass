var contract_mutual = require('./contract_mutual');
var Web3 = require('web3');
var rpc_str = "https://rpc-mainnet.maticvigil.com/";
var rpc_web3 = new Web3(new Web3.providers.HttpProvider(rpc_str));
var abiTool = require('./abiTool')
var chainId = 0x89;
web3 = rpc_web3
// 作业1：transfer
function transferByAbi() {
    var prikeystr= ""; //私钥
    var payContractAddress=""; //支付币的智能合约地址
    var getAccountAddress="";//收款地址
    var payNum = 3.5;
    var input_type = abiTool.getAbiByJsNameAndFunctionName("erc20","transfer")
    contract_mutual.transferByAbi(prikeystr,payContractAddress,getAccountAddress,payNum,input_type,web3,chainId)
}

// 作业2：
// 1.在pancake上用 bnb兑换其他token
function swapEthToTokens() {
    var priKey=""; //私钥
    //
    var tokenaddress="";//(ada地址)要兑换的token合约地址
    var wbnbaddress="";// wbnb代币的合约地址
    var addresspancake = "";//pancake的地址
    var input_type = abiTool.getAbiByJsNameAndFunctionName("pancake","swapETHForExactTokens")
    var path = [wbnbaddress,addresspancake]
    contract_mutual.swapEthToTokens(priKey,tokenaddress,wbnbaddress,addresspancake,input_type,path,web3,chainId);
}

// 1.在pancake上用 其他token兑换bnb
function swapTokensToEth() {
    var priKey=""; //私钥
    // 0x3ee2200efb3400fabb9aacf31297cbdd1d435d47
    var getContractAddress="";//(ada地址)要兑换的token合约地址
    var payContractAddress="";// wbnb代币的合约地址
    var pancakeAddress = "";//pancake的地址
    var input_type = abiTool.getAbiByJsNameAndFunctionName("pancake","swapExactTokensForETH")
    var path = [payContractAddress,getContractAddress]
    contract_mutual.swapTokensToEth(priKey,payContractAddress,getContractAddress,pancakeAddress,input_type,path,web3,chainId);
}

// 2.send
function send() {
    var priKey = "" // 私钥
    var toAddress = tokenaddress = "";
    contract_mutual.send(priKey,toAddress,web3)
}
// 3.token_to_token
async function tokenToToken() {
    var parameter_map = {}
    parameter_map['prikeystring'] = "" // 私钥
    parameter_map['paytokenaddress'] = ""
    parameter_map['wAddress'] = ""
    parameter_map['gettokenaddress'] = ""
    parameter_map['swapAddress'] = ""
    parameter_map['los'] = 2 ;
    parameter_map['pay_token_num'] = 0.0015 //ada
    parameter_map['tokenToTokenRate'] = await contract_mutual.getTokenToTokenRate("","","",web3);
    parameter_map['pancakeFun'] = "swapExactTokensForTokens";
    var input_type = abiTool.getAbiByJsNameAndFunctionName("pancake","swapExactTokensForTokens")
    var path = [parameter_map['paytokenaddress'],parameter_map['gettokenaddress']]
    contract_mutual.tokenToToken(parameter_map,input_type,path,web3,chainId)
}

async function approveByContractAbi(){
    var prikeystr= ""; //私钥
    var payContractAddress=""; //授权合约地址
    var getAccountAddress="";// 被授权合约地址
    var payNum = 3.5;//授权的个数
    var input_type = abiTool.getAbiByJsNameAndFunctionName("erc20","approve")
    contract_mutual.transferByAbi(prikeystr,payContractAddress,getAccountAddress,payNum,input_type,web3,chainId)
}

const main = async () => {

    //作业1：给账户转代币
    transferByAbi()

    //作业2：
    //2.1.在pancake上用 bnb兑换其他token
    //swapEthToTokens()

    //2.1.在pancake上用 token兑换其他bnb
    //approveByContractAbi()
    //swapTokensToEth()

    //2.3.在pancake上用 token兑换其他token
    //approveByContractAbi()
    //tokenToToken()

    //3.授权
    //approveByContractAbi()
}
main()
