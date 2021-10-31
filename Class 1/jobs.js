var contract_mutual = require('./contract_mutual');

// 10个代币地址与对于的查询地址
var tokens_address = require('./tokens_address');

// 作业1：读取10个代币余额
function getTokenBalance(){
    tokens_address.forEach((item)=>{
        contract_mutual.getTokenBalance(item.token_address,item.query_address);
    })
}
// 作业3：
// 1.在pancake上用 bnb兑换其他token
function bnb_to_tokens() {
    var priKey=""; //私钥
    // 0x3ee2200efb3400fabb9aacf31297cbdd1d435d47
    var tokenaddress="0x3ee2200efb3400fabb9aacf31297cbdd1d435d47";//(ada地址)要兑换的token合约地址
    var wbnbaddress="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";// wbnb代币的合约地址
    var addresspancake = "0x10ed43c718714eb63d5aa57b78b54704e256024e";//pancake的地址
    contract_mutual.swap(priKey,tokenaddress,wbnbaddress,addresspancake);
}
// 2.send
function send() {
    var priKey = "" // 私钥
    var toAddress = tokenaddress = "0x9dF37B1A1Ce5dfC0509489CdE0b8a0b6b6a52735";
    contract_mutual.send(priKey,toAddress)
}
// 3.token_to_token
function token_to_token() {
    var parameter_map = {}
    parameter_map['prikeystring'] = "" // 私钥
    parameter_map['tokenaddress'] = "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"
    parameter_map['wbnbaddress'] = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    parameter_map['addresspancake'] = "0x10ed43c718714eb63d5aa57b78b54704e256024e"
    parameter_map['los'] = 50
    parameter_map['source_token_num'] = 0.0015 //wbnb
    parameter_map['tokenToTokenRate'] = 266  //contract_mutual.getTokenToTokenRate("0x28415ff2c35b65b9e5c7de82126b4015ab9d031f","0x3ee2200efb3400fabb9aacf31297cbdd1d435d47","0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c");
    parameter_map['pancakeFun'] = "swapExactTokensForTokens";
    contract_mutual.token_to_token(parameter_map)
}

const main = async () => {
    //作业1：读取10个代币余额   (测试通过)
    //getTokenBalance()


    //作业2：给账户转bnb    (测试通过)
    //send()


    //作业3：
    //3.1.在pancake上用 bnb兑换其他token   (测试通过)
    //bnb_to_tokens()

    //3.2.在pancake上用 token兑换其他token (唉：琢磨了很久还是没走通：主要是swapExactTokensForTokens这个方法的input信息的第一个参数没弄明白)
    //token_to_token()

}
main()