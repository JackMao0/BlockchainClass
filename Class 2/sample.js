//创建一个ABIMAP放所有的ABI
var AllABIMap = new Map();
//只是用来签名一下函数，不需要连接网络
var webtmp = new Web3()
//加载ABI
function loadAbimap(abimapname,url) {
    const pancake = require(url)
    var tmpabimap = new Map();
    
    console.log(pancake.length)
    
    for(var i=0;i<pancake.length;i++)
    {
        let element = pancake[i];
        if (element.type == "function") {
            sign = webtmp.eth.abi.encodeFunctionSignature(element);
            tmpabimap.set(sign, element);
        }
    }
    if(tmpabimap.length!=0)
    {
        AllABIMap.set(abimapname,tmpabimap)
    }
   
    
}
//构造input数据的时候，通过该方法读具体的ABI 中的某个功能
function getAbi(abimapname, functionname) {
    var bfind = false;
    var r;
    abi = AllABIMap.get(abimapname)
    
    for (var [key, value] of abi) 
    {
        if(value.name == functionname)
        {
            bfind = true;
            r = value;
            return [bfind, r];
        }
    }
   
    return [bfind, r];
}

//例子加载ABI到MAP中
loadAbimap('pancakeV2','./pancake.js') ;
//例子，读取ABI的内容取构建inputdata
abi =  getAbi('pancakeV2',"swapETHForExactTokens");
    if(abi[0] == true)
    {
        //do something
    }