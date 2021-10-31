//这部分单独用一个erc20.js封装
module.exports=[ {
        constant: true,
        inputs: [{ name: 'src', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [ {"internalType": "string", 
        "name": "", 
        "type": "string"}],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];