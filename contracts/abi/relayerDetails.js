export const relayerDetails = {
	"networks": {
	    "4": {
	      "events": {},
	      "links": {},
	      "address": "0x6f067E1ff8927824d866d7bfa01Df735CF039e7a"
	    }
	},
	"abi": [
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_signer",
					"type": "address"
				}
			],
			"name": "addToWhitelist",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_to",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_from",
					"type": "address"
				},
				{
					"internalType": "bytes",
					"name": "_data",
					"type": "bytes"
				},
				{
					"internalType": "bytes",
					"name": "_signature",
					"type": "bytes"
				}
			],
			"name": "forward",
			"outputs": [
				{
					"internalType": "bytes",
					"name": "_result",
					"type": "bytes"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "message",
					"type": "bytes32"
				},
				{
					"internalType": "bytes",
					"name": "sig",
					"type": "bytes"
				}
			],
			"name": "recoverSigner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_signer",
					"type": "address"
				}
			],
			"name": "removeFromWhitelist",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes",
					"name": "sig",
					"type": "bytes"
				}
			],
			"name": "splitSignature",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				},
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				},
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]
}