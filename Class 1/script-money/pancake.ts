import { AbiItem } from 'web3-utils';

const pancake: AbiItem[] = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
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
        name: 'swapETHForExactTokens',
        outputs: [
            {
                internalType:
                    'uint256[]',
                name: 'amounts',
                type: 'uint256[]'
            }
        ],
        stateMutability: 'payable',
        type: 'function'
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
    }
];

export default pancake;
