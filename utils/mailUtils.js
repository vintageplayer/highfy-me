import {storeDataOnIPFS, makeFileObject, storeFilesOnIPFS, retrieveFile} from './web3StorageUtils'
import {encryptMessage, decryptMessage, encryptUsingWallet, decryptUsingWallet, generateKeyPair} from './encryptionUtils'
import Web3 from "web3";


const getUserKeyCID = async (address) => {
	const keyEndpoint = `api/userKey/${address.toLowerCase()}`;
	const userKeyResponse = await fetch(keyEndpoint);
	if (userKeyResponse.status == 200) {
		const userKeyResponseJson = await userKeyResponse.json();
		if (userKeyResponseJson['data']['account']) {
			const cid = userKeyResponseJson['data']['account']['keyCID'];
			return cid;
		}
	}
}

export const getUserDetails = async (address) => {
	const detailsEndpoint = `api/userDetails/${address.toLowerCase()}`;
	const userDetailsResponse = await fetch(detailsEndpoint);
	if (userDetailsResponse.status == 200) {
		const userDetailsResponseJson = await userDetailsResponse.json();
			return  userDetailsResponseJson
	}
}

export const fetchKeys = async (address, cid) => {
	// Given CID, fetch the file
	const keyFileData = await retrieveFile(cid, 'web3_mail_info', 'blob');
	const encryptedKeyData = `0x${keyFileData}`;

	// Decrypt the Contents with web3 wallet
	const keyData = await decryptUsingWallet(encryptedKeyData, address);
	return keyData;
}

const fetchPublicKey = async (address) => {
	// For the entered reciver's address, query the public key cid
	const cid = await getUserKeyCID(address);
	if (!cid) {
		return
	}
	const publicKeyData = await retrieveFile(cid, 'web3_mail_pkey');
	return publicKeyData['publicKey'];
}

const encryptMail = async (mailObject, publicKey) => {
	// given message and public key, encrypt the data
	const message = { text: JSON.stringify(mailObject) };
	const encrypted = await encryptMessage(message, publicKey);

	// Return the encrypted data
	return encrypted;
}

export const decryptMail = async (encryptedMail, keys) => {
	// Keys should be fetched once per login and stored somewhere
	const userKeys = JSON.parse(keys);
	try {
		const mailData = await decryptMessage(encryptedMail, userKeys['privateKey'], userKeys['passphrase']);
		return mailData;
	} catch {
		return {};
	}	
}

const emitCreateAccount = async (address, keyCID, contract) => {
	const txHash = await contract.methods.createAccount(keyCID).send({from: address});
	console.log(txHash);
}

const emitSendMail = async (from, to, dataCID, contract) => {
	const txHash = await contract.methods.sendMail(to, dataCID).send({from: from});
	console.log(txHash);
}

export const getMails = async(mailItems, keys, type) => {
	return await Promise.all(mailItems.map(async (mailItem) => {
		const mailFileData = await retrieveFile(mailItem['id'], type, 'blob');
		return {...JSON.parse(await decryptMail(mailFileData, keys)), id: mailItem['id']};
	}));
}

export const createAccount = async (address, contract) => {
	const passphrase = 'super long and hard to guess secret'
	const { privateKey, publicKey } = await generateKeyPair(passphrase);
	const keyData = {
		privateKey: privateKey,
		publicKey: publicKey,
		passphrase: passphrase
	}

	// Encrypt keys & passphrase with wallet
	const encryptedKeyData = await encryptUsingWallet(keyData, address);
	const encryptedKeyFileName = `web3_mail_info`;
	const encryptedKeyFile = makeFileObject(encryptedKeyData, encryptedKeyFileName);


	// Upload Public Key to IPFS
	const publicKeyData = JSON.stringify({
		publicKey: publicKey
	});
	const publicKeyFileName = `web3_mail_pkey`;
	const publicKeyFile = makeFileObject(publicKeyData, publicKeyFileName);
	const keyCID = await storeFilesOnIPFS([encryptedKeyFile, publicKeyFile])

	// Emit Event with address, and the CID
	await emitCreateAccount(address, keyCID, contract);
	const result = {
		address: address,
		keys: keyData,
		keyCID: keyCID
	};
	return result;
}

export const sendMail = async (mailObject, contract) => {
	const receiver = mailObject['to'];
	const receiverPublicKey = await fetchPublicKey(receiver);
	if (!receiverPublicKey) {
		alert(`Account for ${receiver} not found!!`);
		return;
	}
	const receiverData = await encryptMail(mailObject, receiverPublicKey);
	const receiverDataFile = makeFileObject(receiverData, 'inbox');

	const sender = mailObject['from'];
	const senderPublicKey = await fetchPublicKey(sender);
	if (!senderPublicKey) {
		alert(`Account for ${receiver} not found!!`);
		return;
	}
	const senderData = await encryptMail(mailObject, senderPublicKey);
	const senderDataFile = makeFileObject(senderData, 'sent');


	const dataCID = await storeFilesOnIPFS([receiverDataFile, senderDataFile])
	console.log(dataCID);
	await emitSendMail(sender, receiver, dataCID, contract);
	return dataCID;	
}