var contract_mutual = require('./contract_mutual');

// 10个代币地址与对于的查询地址
var tokens_address = require('./tokens_address');

// 作业1：读取10个代币余额
function getTokenBalance(){
    tokens_address.forEach((item)=>{
        contract_mutual.getTokenBalance(item.token_address,item.query_address);
    })
}

// 作业2：transfer
function transferByAbi() {
    var prikeystr= ""; //私钥
    var payContractAddress="0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"; //支付币的智能合约地址
    var getAccountAddress="";//收款地址
    var payNum = 3.5;
    contract_mutual.transferByAbi(prikeystr,payContractAddress,getAccountAddress,payNum)
}

// 作业3：
// 1.在pancake上用 bnb兑换其他token
function swapEthToTokens() {
    var priKey=""; //私钥
    //
    var tokenaddress="0x3ee2200efb3400fabb9aacf31297cbdd1d435d47";//(ada地址)要兑换的token合约地址
    var wbnbaddress="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";// wbnb代币的合约地址
    var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";//pancake的地址
    contract_mutual.swapEthToTokens(priKey,tokenaddress,wbnbaddress,addresspancake);
}

// 1.在pancake上用 其他token兑换bnb
function swapTokensToEth() {
    var priKey=""; //私钥
    // 0x3ee2200efb3400fabb9aacf31297cbdd1d435d47
    var getContractAddress="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//(ada地址)要兑换的token合约地址
    var payContractAddress="0x3ee2200efb3400fabb9aacf31297cbdd1d435d47";// wbnb代币的合约地址
    var pancakeAddress = "0x10ed43c718714eb63d5aa57b78b54704e256024e";//pancake的地址
    contract_mutual.swapTokensToEth(priKey,payContractAddress,getContractAddress,pancakeAddress);
}

// 2.send
function send() {
    var priKey = "" // 私钥
    var toAddress = tokenaddress = "";
    contract_mutual.send(priKey,toAddress)
}
// 3.token_to_token
async function tokenToToken() {
    var parameter_map = {}
    parameter_map['prikeystring'] = "" // 私钥
    parameter_map['adatokenaddress'] = "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"
    parameter_map['wbnbaddress'] = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    parameter_map['atomtokenaddress'] = "0x0eb3a705fc54725037cc9e008bdede697f62f335"
    parameter_map['pancakeaddress'] = "0x10ed43c718714eb63d5aa57b78b54704e256024e"
    parameter_map['los'] = 2
    parameter_map['pay_token_num'] = 0.0015 //ada
    parameter_map['tokenToTokenRate'] = await contract_mutual.getTokenToTokenRate("0xba591bf624b363b49476c0d1d2dbb5a566512a6f","0x0eb3a705fc54725037cc9e008bdede697f62f335","0x3ee2200efb3400fabb9aacf31297cbdd1d435d47");
    parameter_map['pancakeFun'] = "swapExactTokensForTokens";
    contract_mutual.tokenToToken(parameter_map)
}

const main = async () => {
    //作业1：读取10个代币余额
    //getTokenBalance()


    //作业2：给账户转代币
    //transferByAbi()

    //作业3：
    //3.1.在pancake上用 bnb兑换其他token
    //swapEthToTokens()

    //3.1.在pancake上用 token兑换其他bnb
    //swapTokensToEth()

    //3.3.在pancake上用 token兑换其他token
    //tokenToToken()

}
main()