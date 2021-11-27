const VexchangeV2FactoryABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_defaultSwapFee",
                "type": "uint256",
            },
            {
                "internalType": "uint256",
                "name": "_defaultPlatformFee",
                "type": "uint256",
            },
            {
                "internalType": "address",
                "name": "_platformFeeTo",
                "type": "address",
            },
            {
                "internalType": "address",
                "name": "_defaultRecoverer",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldDefaultPlatformFee",
                "type": "uint256",
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newDefaultPlatformFee",
                "type": "uint256",
            },
        ],
        "name": "DefaultPlatformFeeChanged",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "oldDefaultRecoverer",
                "type": "address",
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newDefaultRecoverer",
                "type": "address",
            },
        ],
        "name": "DefaultRecovererChanged",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldDefaultSwapFee",
                "type": "uint256",
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newDefaultSwapFee",
                "type": "uint256",
            },
        ],
        "name": "DefaultSwapFeeChanged",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
            },
        ],
        "name": "OwnershipTransferred",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token0",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token1",
                "type": "address",
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "pair",
                "type": "address",
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "swapFee",
                "type": "uint256",
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "platformFee",
                "type": "uint256",
            },
        ],
        "name": "PairCreated",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "oldFeeTo",
                "type": "address",
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newFeeTo",
                "type": "address",
            },
        ],
        "name": "PlatformFeeToChanged",
        "type": "event",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "MAX_PLATFORM_FEE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "MAX_SWAP_FEE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "MIN_SWAP_FEE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "name": "allPairs",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "allPairsLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenA",
                "type": "address",
            },
            {
                "internalType": "address",
                "name": "tokenB",
                "type": "address",
            },
        ],
        "name": "createPair",
        "outputs": [
            {
                "internalType": "address",
                "name": "pair",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "defaultPlatformFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "defaultPlatformFeeOn",
        "outputs": [
            {
                "internalType": "bool",
                "name": "_platformFeeOn",
                "type": "bool",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "defaultRecoverer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "defaultSwapFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "name": "getPair",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getPairInitHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32",
            },
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [],
        "name": "platformFeeTo",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address",
            },
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_platformFee",
                "type": "uint256",
            },
        ],
        "name": "setDefaultPlatformFee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_recoverer",
                "type": "address",
            },
        ],
        "name": "setDefaultRecoverer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_swapFee",
                "type": "uint256",
            },
        ],
        "name": "setDefaultSwapFee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_pair",
                "type": "address",
            },
            {
                "internalType": "uint256",
                "name": "_platformFee",
                "type": "uint256",
            },
        ],
        "name": "setPlatformFeeForPair",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_platformFeeTo",
                "type": "address",
            },
        ],
        "name": "setPlatformFeeTo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_pair",
                "type": "address",
            },
            {
                "internalType": "address",
                "name": "_recoverer",
                "type": "address",
            },
        ],
        "name": "setRecovererForPair",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_pair",
                "type": "address",
            },
            {
                "internalType": "uint256",
                "name": "_swapFee",
                "type": "uint256",
            },
        ],
        "name": "setSwapFeeForPair",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
            },
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
];

module.exports = {
    VexchangeV2FactoryABI,
};
