//--------------------------------
//Date:2021-10-30  Author:Locusts
//--------------------------------

//查询的token代币地址
const tokenlist = ["0xad29abb318791d579433d831ed122afeaf29dcfe",//FTM
                   "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",//CAKE
                   "0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb",//SFP
                   "0x8f0528ce5ef7b51152a59745befdd91d97091d2f",//ALPACA
                   "0xa184088a740c695e156f91f5cc086a06bb78b827",//AUTO
                   "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",//BIFI
                   "0x715d400f88c167884bbcc41c5fea407ed4d2f8a0",//AXS
                   "0xf307910a4c7bbc79691fd374889b36d8531b08e3",//ANKR
                   "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",//UNI
                   "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",//USDC
                   "0x55d398326f99059ff775485246999027b3197955"]//USDT

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

//查询代币余额的钱包地址
var querywallet = ''//ETH1
//私钥
var walletprivatekey = ''//ETH2
var Web3 = require('web3')
//bsc rpc地址
var rpcaddress = 'https://bsc-dataseed3.ninicoin.io/'
console.log(`Current web3 package version: ${Web3.version}\n`)
var web3 = new Web3(new Web3.providers.HttpProvider(rpcaddress))

const erc20 = require('./erc20.js')
var EthereumTx = require('ethereumjs-tx')
const ethutil = require('ethereumjs-util')

//获取地址的token个数
const getTokenBalance = async (tokenAddress, queryAddress) => {
    //创建代币的智能合约函数
    var tokenContract = new web3.eth.Contract(erc20, tokenAddress)
    //获取代币余额
    let result = await tokenContract.methods.balanceOf(queryAddress).call()
    //获取代币小数位数
    let decimals = await tokenContract.methods.decimals().call()
    weiname = getweiname(decimals)
    let tokenBalance = web3.utils.fromWei(result.toString(10), weiname)
    //获取代币名称
    let symbol = await tokenContract.methods.symbol().call()
    console.log(`地址:${queryAddress} 有代币:${symbol}的数量是${tokenBalance}`)
    return tokenBalance
}

//转成16进制的buffer
var privatekey = Buffer.from(walletprivatekey.replace('0x',''), 'hex')

//这里是将交易用私钥签名部分
function getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) {
    var rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(gaslimit),
        "gasPrice": web3.utils.toHex(gasPrice),
        "to": toAddress,
        "value": web3.utils.toHex(nbnb),
        "data": input,
        "chainId": 0x38 //4:Rinkeby, 3:Ropsten, 1:mainnet
    };
    var tx = new EthereumTx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    return serializedTx;
}

//将签名的内容发送到区块链网络中
const signTransaction = async (fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit) => {
    var serializedTx = getEthRawTx(fromAddress, toAddress, input, nonceNum, privKey, gasPrice, nbnb, gaslimit)
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
    if (receipt.status == true) {
        return true;
    }
    return false;
}

const send = async () => {
    var fromaddress = `0x${ethutil.privateToAddress(privatekey).toString('hex')}`
    var toaddress = querywallet
    //发送0.0008个BNB
    var sendbnbamount = web3.utils.toWei((0.0008).toString(10), 'ether')
    //设置gasprice为5
    var gasprice = web3.utils.toWei((5).toString(10), 'GWei')
    var gaslimit = 420000
    var input = '0x00'
    console.log(`发送地址是:${fromaddress}`)
    var noncecount = await web3.eth.getTransactionCount(fromaddress);
    let reslut = await signTransaction(fromaddress, toaddress, input, noncecount, privatekey, gasprice, sendbnbamount, gaslimit)
    if (reslut) {
        console.log("交易成功")
    }
    else {
        console.log("交易失败")
    }
}

var moment = require('moment')
var pancake = require('./pancake.js')

function swaptokeninput(wbnbaddress, toaddress, tokenamountin, amountout, tokenaddress, tokendecimals = 18, swapType = 0)
{
    weiname = getweiname(tokendecimals)
    var path = [wbnbaddress, tokenaddress]
    var minAountOut = web3.utils.toWei(amountout.toString(10), weiname)
    const now = moment().unix()
    const DEADLINE = now + 60 * 20
    var deadline = DEADLINE.toString(10)
    console.log('input before')
    console.log('------------------------------------------------------------')
    //console.log(pancake[0])
    var input = ''
    console.log(pancake[swapType])
    if(swapType == 0){//swapETHForExactTokens
        input = web3.eth.abi.encodeFunctionCall(pancake[swapType], [minAountOut, path, toaddress, deadline])
    }
    else if(swapType == 1){//swapExactTokensForETH
        input = web3.eth.abi.encodeFunctionCall(pancake[swapType], [tokenamountin, minAountOut, path, toaddress, deadline])
    }
    console.log('input after')
    console.log('------------------------------------------------------------')
    console.log(input)
    return input
}

//实现一个从wbnb到cake的交换函数
const swapETHForExactTokens = async () => {
    //这里设置自己的钱包地址
    var fromAddress = `0x${ethutil.privateToAddress(privatekey).toString('hex')}`
    //cake地址
    var tokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    var tokencontract = new web3.eth.Contract(erc20, tokenAddress) // CAKE
    let decimals = await tokencontract.methods.decimals().call()
    //设置交易滑点
    var los = 50
    var bnb = 0.0005
    var rate = 57
    var ntoken = bnb * (100 - los) / 100 * rate
    var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    // v2自动路由地址
    var pancakeroutev2 = "0x10ed43c718714eb63d5aa57b78b54704e256024e" 
    var nonceNum = await web3.eth.getTransactionCount(fromAddress)
    //0.0005个bnb
    nbnb = web3.utils.toWei((bnb).toString(10), 'ether')
    gasprice = web3.utils.toWei((5).toString(10), 'Gwei')
    var gaslimit = 420000
    var input = swaptokeninput(wbnbaddress, fromAddress, nbnb, ntoken, tokenAddress, decimals)
    let result = await signTransaction(fromAddress, pancakeroutev2, input, nonceNum, privatekey, gasprice, nbnb, gaslimit)
    if(result){
        console.log('swapETHForExactTokens交易成功')
    }
    else{
        console.log('swapETHForExactTokens交易失败')
    }
}


//实现一个从cake到bnb的交互函数
const swapExactTokensForETH = async () => {
    //这里设置自己的钱包地址
    var fromAddress = `0x${ethutil.privateToAddress(privatekey).toString('hex')}`
    var wbnbaddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    var tokencontract = new web3.eth.Contract(erc20, wbnbaddress) //WBNB
    let decimals = await tokencontract.methods.decimals().call()
    //设置交易滑点
    var los = 50
    var cake = 0.01
    var rate = 60
    //var ntoken = cake / (100 - los) / 100 * rate
    var ntoken = 0.0002
    var cakeAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    // v2自动路由地址
    var pancakeroutev2 = "0x10ed43c718714eb63d5aa57b78b54704e256024e" 
    var nonceNum = await web3.eth.getTransactionCount(fromAddress)
    //0.01个cake
    ncake = web3.utils.toWei((cake).toString(10), 'ether')
    gasprice = web3.utils.toWei((5).toString(10), 'Gwei')
    var gaslimit = 420000
    //var input = swaptokeninput(wbnbaddress, fromAddress, nbnb, ntoken, tokenAddress, decimals)
    var input = swaptokeninput(cakeAddress, fromAddress, ncake, ntoken, wbnbaddress, decimals, 1)
    let result = await signTransaction(fromAddress, pancakeroutev2, input, nonceNum, privatekey, gasprice, ncake, gaslimit)
    if(result){
        console.log('交易成功')
    }
    else{
        console.log('交易失败')
    }
}

const main = () => {
    //1、在源代码的基础上读取10个代币的数量
    for (let index = 0; index < tokenlist.length; index++) {
        const tokenaddress = tokenlist[index];
        getTokenBalance(tokenaddress, querywallet)
    }

    //2、在源代码的基础上，调用代币的transfor功能转移代币（比如WBNB）
    //send()

    //3、实现pancake的swap功能比如 ETHtotoken，tokentotoken，tokentoswap
    //3.1、实现pancake swap的swapETHForExactTokens功能 这里是将wbnb转成cake
    //swapETHForExactTokens()


    //3.2、实现pancake swap的swapExactTokensForETH功能 将cake转成wbnb 返回错误还需要调试
    //swapExactTokensForETH()
}

main()