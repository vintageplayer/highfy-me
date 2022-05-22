import { storeDataOnIPFS, makeFileObject, storeFilesOnIPFS, retrieveFile } from "./web3StorageUtils";
import { encryptMessage, decryptMessage, encryptUsingWallet, decryptUsingWallet, generateKeyPair } from "./encryptionUtils";
import Web3 from "web3";
import axios from "axios";

const getUserKeyCID = async (address) => {
	const keyEndpoint = `api/userKey/${address.toLowerCase()}`;
	const userKeyResponse = await fetch(keyEndpoint);
	if (userKeyResponse.status == 200) {
		const userKeyResponseJson = await userKeyResponse.json();
		if (userKeyResponseJson["data"]["account"]) {
			const cid = userKeyResponseJson["data"]["account"]["keyCID"];
			return cid;
		}
	}
};

export const getUserDetails = async (address) => {
	const detailsEndpoint = `api/userDetails/${address.toLowerCase()}`;
	const userDetailsResponse = await fetch(detailsEndpoint);
	if (userDetailsResponse.status == 200) {
		const userDetailsResponseJson = await userDetailsResponse.json();
		return userDetailsResponseJson;
	}
};

export const fetchKeys = async (address, cid) => {
	// Given CID, fetch the file
	const keyFileData = await retrieveFile(cid, "web3_mail_info", "blob");
	const encryptedKeyData = `0x${keyFileData}`;

	// Decrypt the Contents with web3 wallet
	const keyData = await decryptUsingWallet(encryptedKeyData, address);
	return keyData;
};

const fetchPublicKey = async (address) => {
	// For the entered reciver's address, query the public key cid
	const cid = await getUserKeyCID(address);
	if (!cid) {
		return;
	}
	const publicKeyData = await retrieveFile(cid, "web3_mail_pkey");
	return publicKeyData["publicKey"];
};

const encryptMail = async (mailObject, publicKey) => {
	// given message and public key, encrypt the data
	const message = { text: JSON.stringify(mailObject) };
	const encrypted = await encryptMessage(message, publicKey);

	// Return the encrypted data
	return encrypted;
};

export const decryptMail = async (encryptedMail, userKeys) => {
	// Keys should be fetched once per login and stored somewhere
	try {
		const mailData = await decryptMessage(encryptedMail, userKeys["privateKey"], userKeys["passphrase"]);
		return mailData;
	} catch {
		return {};
	}
};

export const emitToRelayer = async (from, calldata, signature, contractAddress) => {
	const payload = JSON.stringify({
		from: from,
		to: contractAddress,
		data: calldata,
		signature: signature,
	});

	const res = await axios.post("/api/relayer/sendToRelayer", payload, {
		headers: {
			"Content-type": "application/json",
		},
	});

	console.log(res);

	if (!res.error) {
		return res.data.tx_hash;
	} else {
		return "";
	}
};

export const isTransactionComplete = async (txHash) => {
	if (txHash == null || txHash == "") {
		return "";
	}

	const res = await axios.get("/api/getTransactionStatus", { params: { tx_hash: txHash } });

	if (res.data && res.data.transaction) {
		const transaction = res.data.transaction;
		return transaction.blockNumber != null ? true : false;
	}

	return "";
};

export const emitSendMail = async (from, to, dataCID, credits, contract) => {
	const txHash = await contract.methods.sendMail(to, dataCID, credits).send({ from: from });
	console.log(txHash);
};

export const emitChangeLabel = async (from, to, label, contract) => {
	console.log();
	const txHash = await contract.methods.modifySenderLabel(from, label).send({ from: to });
	console.log(txHash);
};

export const emitMailAction = async (from, to, dataCID, action, contract) => {
	const txHash = await contract.methods.mailAction(from, dataCID, action).send({ from: to });
	console.log(txHash);
};

export const getMail = async (mailItem, keys, type) => {
	const mailFileData = await retrieveFile(mailItem["dataCID"], type, "blob");
	try {
		return { ...mailItem, mailObject: JSON.parse(await decryptMail(mailFileData, keys)) };
	} catch {
		return { ...mailItem, mailObject: {} };
	}
};

export const getMails = async (mailItems, keys, type) => {
	return await Promise.all(
		mailItems.map(async (mailItem) => {
			const mailFileData = await retrieveFile(mailItem["id"], type, "blob");
			try {
				return {
					...JSON.parse(await decryptMail(mailFileData, keys)),
					id: mailItem["id"],
				};
			} catch {
				return {};
			}
		})
	);
};

export const prepareAccountFile = async (address, updateCallback) => {
	const passphrase = "super long and hard to guess secret";
	updateCallback("Generating New User Keys to encrypt/decrypt..");

	const { privateKey, publicKey } = await generateKeyPair(passphrase);
	const keyData = {
		privateKey: privateKey,
		publicKey: publicKey,
		passphrase: passphrase,
	};

	updateCallback("Encrypting User Keys Using Wallet...");
	// Encrypt keys & passphrase with wallet
	const encryptedKeyData = await encryptUsingWallet(keyData, address);
	const encryptedKeyFileName = `web3_mail_info`;

	updateCallback("Creating Keys to Store on IPFS...");

	// Upload Public Key to IPFS
	const publicKeyData = JSON.stringify({
		publicKey: publicKey,
	});
	const publicKeyFileName = `web3_mail_pkey`;

	const payload = JSON.stringify({
		fileData: [
			{ name: encryptedKeyFileName, value: encryptedKeyData },
			{ name: publicKeyFileName, value: publicKeyData },
		],
	});

	updateCallback("Storing User Key on IPFS...");
	const res = await axios.post("/api/web3storage/storeFilesOnIPFS", payload, {
		headers: {
			"Content-type": "application/json",
		},
	});

	const keyCID = res.data.cid;

	const result = {
		address: address,
		keys: keyData,
		keyCID: keyCID,
	};
	return result;
};

export const createAccount = async (address, updateCallback) => {
	const passphrase = "super long and hard to guess secret";
	updateCallback("Generating New User Keys to encrypt/decrypt..");
	const { privateKey, publicKey } = await generateKeyPair(passphrase);
	const keyData = {
		privateKey: privateKey,
		publicKey: publicKey,
		passphrase: passphrase,
	};
	console.log('wtf')
	updateCallback("Encrypting User Keys Using Wallet...");
	// Encrypt keys & passphrase with wallet
	console.log('hereeee -- ',keyData, address);
	const encryptedKeyData = await encryptUsingWallet(keyData, address);
	const encryptedKeyFileName = `web3_mail_info`;
	console.log('her1')
	updateCallback("Creating Keys to Store on IPFS...");
	const encryptedKeyFile = makeFileObject(encryptedKeyData, encryptedKeyFileName);

	// Upload Public Key to IPFS
	const publicKeyData = JSON.stringify({
		publicKey: publicKey,
	});
	const publicKeyFileName = `web3_mail_pkey`;
	const publicKeyFile = makeFileObject(publicKeyData, publicKeyFileName);
	updateCallback("Storing User Key on IPFS...");
	const keyCID = await storeFilesOnIPFS([encryptedKeyFile, publicKeyFile], true);

	const result = {
		address: address,
		keys: keyData,
		keyCID: keyCID,
	};
	return result;
};

export const emitCreateAccount = async (address, keyCID, contract) => {
	const txHash = await contract.methods.createAccount(keyCID).send({from: address});
	console.log(txHash);
}

export const prepareEmitAccountParams = async (from, keyCID, web3Provider) => {
	let calldata = web3Provider.eth.abi.encodeFunctionCall(
		{
			name: "createAccount",
			type: "function",
			inputs: [
				{
					type: "address",
					name: "from",
				},
				{
					type: "string",
					name: "keyCID",
				},
			],
		},
		[from, keyCID]
	);

	let hash = web3Provider.utils.soliditySha3(calldata); // sign the hash.
	let signature = await web3Provider.eth.sign(hash, from);

	return { calldata, signature };
};

export const prepareMailFile = async (mailObject, senderPublicKey) => {
	const receiver = mailObject["to"];
	console.log("preparing Mail File", [mailObject, senderPublicKey]);
	const receiverPublicKey = await fetchPublicKey(receiver);
	if (!receiverPublicKey) {
		alert(`Account for ${receiver} not found!!`);
		return;
	}

	const receiverData = await encryptMail(mailObject, receiverPublicKey);
	const senderData = await encryptMail(mailObject, senderPublicKey);

	const payload = JSON.stringify({
		fileData: [
			{ name: "inbox", value: receiverData },
			{ name: "sent", value: senderData },
		],
	});

	const res = await axios.post("/api/web3storage/storeFilesOnIPFS", payload, {
		headers: {
			"Content-type": "application/json",
		},
	});

	const dataCID = res.data.cid;

	console.log(dataCID);
	return dataCID;
};

export const prepareEmitMailParams = async (mailObject, dataCID, web3Provider) => {
	let calldata = web3Provider.eth.abi.encodeFunctionCall(
		{
			name: "sendMail",
			type: "function",
			inputs: [
				{
					type: "address",
					name: "from",
				},
				{
					type: "address",
					name: "to",
				},
				,
				{
					type: "string",
					name: "dataCID",
				},
				{
					type: "uint",
					name: "credits"
				}
			],
		},
		[mailObject["from"], mailObject["to"], dataCID, mailObject["credits"]]
	);

	let hash = web3Provider.utils.soliditySha3(calldata); // sign the hash.
	let signature = await web3Provider.eth.sign(hash, mailObject["from"]);

	return { calldata, signature };
};
