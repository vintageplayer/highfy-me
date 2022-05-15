import {storeDataOnIPFS, makeFileObject, storeFilesOnIPFS, retrieveFile} from '../utils/web3StorageUtils'
import {encryptMessage, decryptMessage, decryptUsingWallet} from './encryptionUtils'
import UserProfile from './user'
import {mailContract} from '../lib/contracts'
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
		if (userDetailsResponseJson['data']['account']) {
			return  userDetailsResponseJson
		}
	}
}

const fetchKeys = async (address, cid) => {
	// If Account Exists, the CID should be available
	// const cid = 'bafybeibhqhlmj47j4rzzwye2pvvxldpgjj27mg3jkllxzzplst2dcqnwe4';		
	// const address = '0x13782baA7DDf58ECf4A0FD9F38Fd003f9955b217';

	// const cid = await getUserKeyCID(address);


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

export const decryptMail = async (encryptedMail) => {
	// Keys should be fetched once per login and stored somewhere
	const userKeys = JSON.parse(UserProfile.getKeys());
	const mailData = await decryptMessage(encryptedMail, userKeys['privateKey'], userKeys['passphrase']);
	return mailData;
}

export const emitCreateAccount = async (address, keyCID, contract) => {
	const txHash = await contract.methods.createAccount(keyCID).send({from: address});
	console.log(txHash);
}

const emitSendMail = async (from, to, dataCID, contract) => {
	const txHash = await contract.methods.sendMail(to, dataCID).send({from: from});
	console.log(txHash);
}

export const loginUser = async (address) => {
	const userDetails = await getUserDetails(address);
	// const cid = await getUserKeyCID(address);
	const cid = userDetails['data']['account']['keyCID'];
	if (!cid) {
		return
	}
	UserProfile.setKeys(await fetchKeys(address, cid));
	UserProfile.setInbox(userDetails['data']['account']['inbox']);
	UserProfile.setSent(userDetails['data']['account']['mailsSent']);
	console.log(UserProfile.getInbox());
	console.log('User Logged In');
}

export const getMails = async() => {	
	const mails = await Promise.all(UserProfile.getInbox().map(async (mailItem) => {
		const mailFileData = await retrieveFile(mailItem['id'], 'inbox', 'blob');
		return JSON.parse(await decryptMail(mailFileData));
	}));
	return mails;
}

// export const getMails = async(user) => {
	// const cids = [
	// 	"bafybeifblgpfoqmegmoxuqpys43dcer7up55twlwojk7sqfqe6xo5gouna",
	// 	"bafybeichoujfhhsaood5bh32dgkphgyf7efudn24qrvtmidvked6p7qera",
	// 	"bafybeif63x5rrvxgnhi7cydfbuarpqm5epbujfb7gpilsliokawylbrkoi",
	// 	"bafybeiacqjd6izxnoy5wmdvy4wrdnv6obftdtsbypbekpdsg3raiza5n2y"
	// 	];
	// const mails = await Promise.all(cids.map(async (cid) => {
	// 	const mailFileData = await retrieveFile(cid, 'web3_mail', 'blob');
	// 	return JSON.parse(await decryptMail(mailFileData));
	// }));
	// return mails;
// }

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

export const getContract = async (w3) => {
	const networkId = await w3.eth.net.getId();
	const deployedNetwork = mailContract.networks[networkId];
	let c = new w3.eth.Contract(mailContract.abi, deployedNetwork.address);
	console.log(deployedNetwork.address);
	return c;
}
