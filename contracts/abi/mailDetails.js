export const mailContract = {
	"contractName": "Mail",
	"abi": [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "relayer",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "accountAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "dataCID",
					"type": "string"
				}
			],
			"name": "AccountCreated",
			"type": "event"
		},
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
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "dataCID",
					"type": "string"
				}
			],
			"name": "mailSent",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "relayer",
					"type": "address"
				}
			],
			"name": "relayerChanged",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "keyCID",
					"type": "string"
				}
			],
			"name": "createAccount",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "deprecateContract",
			"outputs": [],
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
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "dataCID",
					"type": "string"
				}
			],
			"name": "sendMail",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "dataCID",
					"type": "string"
				}
			],
			"name": "sendMail",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "relayer",
					"type": "address"
				}
			],
			"name": "setRelayer",
			"outputs": [],
			"stateMutability": "nonpayable",
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
	],
  "networks": {
    "4": {
      "events": {},
      "links": {},
      "address": "0x04CF013029f717E6e9Ce35c5d0196e3e883A0d63"
    },
    "80001": {
      "events": {},
      "links": {},
      "address": "0x7daD87C073407d4cc84e31B6F57b588BcF25Eb39"
    }
  }
};