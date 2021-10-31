module.exports = {
    "pancakeMap":{"swapETHForExactTokens":{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "swapETHForExactTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },"swapTokensForExactTokens":{
            "inputs": [{
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            }, {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            }, {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }, {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }],
            "name": "swapTokensForExactTokens",
            "outputs": [{
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        "swapExactTokensForTokens":{
            "type": 'function',
            "name": 'swapExactTokensForTokens',
            "inputs": [{
                internalType: "uint256",
                name: 'amountIn',
                type: 'uint256',
            },
                {
                    internalType: "uint256",
                    name: 'amountOutMin',
                    type: 'uint256',
                },
                {
                    internalType: "address[]",
                    name: 'path',
                    type: 'address[]',
                },
                {
                    internalType: "address",
                    name: 'to',
                    type: 'address',
                },
                {
                    internalType: "uint256",
                    name: 'deadline',
                    type: 'uint256',
                },
            ],
        }},
    "erc20": [
        {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [{name: '', type: 'bytes32'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [],
            name: 'stop',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'guy', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'approve',
            outputs: [{name: '', type: 'bool'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'owner_', type: 'address'}],
            name: 'setOwner',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [{name: '', type: 'uint256'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'src', type: 'address'},
                {name: 'dst', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'transferFrom',
            outputs: [{name: '', type: 'bool'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [{name: '', type: 'uint256'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'guy', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'mint',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'wad', type: 'uint256'}],
            name: 'burn',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'name_', type: 'bytes32'}],
            name: 'setName',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [{name: 'src', type: 'address'}],
            name: 'balanceOf',
            outputs: [{name: '', type: 'uint256'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'stopped',
            outputs: [{name: '', type: 'bool'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'authority_', type: 'address'}],
            name: 'setAuthority',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'owner',
            outputs: [{name: '', type: 'address'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'symbol',
            outputs: [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'guy', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'burn',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'wad', type: 'uint256'}],
            name: 'mint',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'dst', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'transfer',
            outputs: [{name: '', type: 'bool'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'dst', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'push',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'src', type: 'address'},
                {name: 'dst', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'move',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: false,
            inputs: [],
            name: 'start',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [],
            name: 'authority',
            outputs: [{name: '', type: 'address'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [{name: 'guy', type: 'address'}],
            name: 'approve',
            outputs: [{name: '', type: 'bool'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            constant: true,
            inputs: [
                {name: 'src', type: 'address'},
                {name: 'guy', type: 'address'}
            ],
            name: 'allowance',
            outputs: [{name: '', type: 'uint256'}],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        },
        {
            constant: false,
            inputs: [
                {name: 'src', type: 'address'},
                {name: 'wad', type: 'uint256'}
            ],
            name: 'pull',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [{name: 'symbol_', type: 'bytes32'}],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor'
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, name: 'guy', type: 'address'},
                {indexed: false, name: 'wad', type: 'uint256'}
            ],
            name: 'Mint',
            type: 'event'
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, name: 'guy', type: 'address'},
                {indexed: false, name: 'wad', type: 'uint256'}
            ],
            name: 'Burn',
            type: 'event'
        },
        {
            anonymous: false,
            inputs: [{indexed: true, name: 'authority', type: 'address'}],
            name: 'LogSetAuthority',
            type: 'event'
        },
        {
            anonymous: false,
            inputs: [{indexed: true, name: 'owner', type: 'address'}],
            name: 'LogSetOwner',
            type: 'event'
        },
        {
            anonymous: true,
            inputs: [
                {indexed: true, name: 'sig', type: 'bytes4'},
                {indexed: true, name: 'guy', type: 'address'},
                {indexed: true, name: 'foo', type: 'bytes32'},
                {indexed: true, name: 'bar', type: 'bytes32'},
                {indexed: false, name: 'wad', type: 'uint256'},
                {indexed: false, name: 'fax', type: 'bytes'}
            ],
            name: 'LogNote',
            type: 'event'
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, name: 'src', type: 'address'},
                {indexed: true, name: 'guy', type: 'address'},
                {indexed: false, name: 'wad', type: 'uint256'}
            ],
            name: 'Approval',
            type: 'event'
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, name: 'src', type: 'address'},
                {indexed: true, name: 'dst', type: 'address'},
                {indexed: false, name: 'wad', type: 'uint256'}
            ],
            name: 'Transfer',
            type: 'event'
        }
    ],
    "pancake": [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "swapETHForExactTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            }, {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            }, {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }, {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }],
            "name": "swapTokensForExactTokens",
            "outputs": [{
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    "pancakeAll":[{
        "inputs": [{
            "internalType": "address",
            "name": "_factory",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "_WETH",
            "type": "address"
        }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {
        "inputs": [],
        "name": "WETH",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amountADesired",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountBDesired",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountAMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountBMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "addLiquidity",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountA",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountB",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "token",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amountTokenDesired",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "addLiquidityETH",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountToken",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "factory",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveOut",
            "type": "uint256"
        }],
        "name": "getAmountIn",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }],
        "stateMutability": "pure",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveOut",
            "type": "uint256"
        }],
        "name": "getAmountOut",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }],
        "stateMutability": "pure",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }],
        "name": "getAmountsIn",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }],
        "name": "getAmountsOut",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountA",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveA",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "reserveB",
            "type": "uint256"
        }],
        "name": "quote",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountB",
            "type": "uint256"
        }],
        "stateMutability": "pure",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountAMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountBMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "removeLiquidity",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountA",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountB",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "token",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "removeLiquidityETH",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountToken",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "token",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "token",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }, {
            "internalType": "bool",
            "name": "approveMax",
            "type": "bool"
        }, {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
        }, {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
        }, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }],
        "name": "removeLiquidityETHWithPermit",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountToken",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "token",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }, {
            "internalType": "bool",
            "name": "approveMax",
            "type": "bool"
        }, {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
        }, {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
        }, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }],
        "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountETH",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountAMin",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountBMin",
            "type": "uint256"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }, {
            "internalType": "bool",
            "name": "approveMax",
            "type": "bool"
        }, {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
        }, {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
        }, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }],
        "name": "removeLiquidityWithPermit",
        "outputs": [{
            "internalType": "uint256",
            "name": "amountA",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountB",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapETHForExactTokens",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactETHForTokens",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactTokensForETH",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactTokensForTokens",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountInMax",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapTokensForExactETH",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "amountInMax",
            "type": "uint256"
        }, {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        }, {
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }],
        "name": "swapTokensForExactTokens",
        "outputs": [{
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "stateMutability": "payable",
        "type": "receive"
    }]
}