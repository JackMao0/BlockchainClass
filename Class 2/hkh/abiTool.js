var Web3 = require('web3');
var allAbi = new Map();
var webAbiTool = new Web3();
function readAbiToMapByJs(abiJsName) {
    var itemFunctionMap = new Map();
    var basePath = "./"+abiJsName;
    const abiJs = require(basePath);
    for(var i=0; i<abiJs.length; i++){
        let item = abiJs[i];
        if(item.type == "function"){
            let functionKey = webAbiTool.eth.abi.encodeFunctionSignature(item);
            itemFunctionMap.set(functionKey,item);
        }
    }
    if(itemFunctionMap.size>0){
        allAbi.set(abiJsName,itemFunctionMap)
    }
}

function getAbiFromMap(abiJsName,functionName) {
    let itemMap = allAbi.get(abiJsName);
    for(var [key,value] of itemMap){
        if(value.name == functionName){
            return[true,value];
        }
    }
    return [false ,{}]
}

function getAbiByJsNameAndFunctionName(abiJsName,functionName) {
    var basePath = "./"+abiJsName;
    const abiJs = require(basePath);
    for(var i=0; i<abiJs.length; i++){
        let item = abiJs[i];
        if(item.type == "function" && item.name == functionName){
            return[true,item]
        }
    }
    return [false,{}]
}
const main = async ()=>{
    var funName = "swapExactTokensForTokens";
    console.log(funName);
    let result1 = getAbiByJsNameAndFunctionName("pancakeAbi",funName);
    if(result1[0]){
        console.log("pancakeAbi");
        console.log(result1[1]);
    }

    let result2 = getAbiByJsNameAndFunctionName("quickSwapAbi",funName);
    if(result2[0]){
        console.log("quickSwapAbi");
        console.log(result2[1]);
    }

    let result3 = getAbiByJsNameAndFunctionName("spookySwapAbi",funName);
    if(result3[0]){
        console.log("spookySwapAbi");
        console.log(result3[1]);
    }


}


module.exports = {
    readAbiToMapByJs:readAbiToMapByJs,
    getAbiFromMap:getAbiFromMap,
    getAbiByJsNameAndFunctionName,getAbiByJsNameAndFunctionName
}