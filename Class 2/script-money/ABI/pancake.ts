import { AbiItem } from 'web3-utils';
import { ABIInfo } from '../ABILoader';

const routerAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'
const rpc = 'https://bsc-dataseed1.binance.org/'
const chainID = 0x38

// PancakeRouter: https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e#code
const pancake: AbiItem[] = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountOutMin",
                type: "uint256"
            },
            {
                internalType: "address[]",
                name: "path",
                type: "address[]"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256"
            }
        ],
        name: "swapExactETHForTokens",
        outputs: [
            {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }
        ],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'amountOutMin',
                type: 'uint256'
            },
            {
                internalType:
                    'address[]',
                name: 'path',
                type: 'address[]'
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256'
            }
        ],
        name: 'swapExactTokensForETH',
        outputs: [
            {
                internalType:
                    'uint256[]',
                name: 'amounts',
                type: 'uint256[]'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "amountOutMin",
                type: "uint256"
            },
            {
                internalType: "address[]",
                name: "path",
                type: "address[]"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256"
            }
        ],
        name: "swapExactTokensForTokens",
        outputs: [
            {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
];

const abiInfo: ABIInfo = { routerAddress, rpc, abi: pancake, chainID }

export default abiInfo
