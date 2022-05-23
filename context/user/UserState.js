import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import {
	createAccount,
	getUserDetails,
	fetchKeys,
	getMail,
	prepareMailFile,
	emitCreateAccount,
	emitSendMail,
	emitChangeLabel,
	emitMailAction,
	prepareEmitMailParams,
	emitToRelayer,
	isTransactionComplete,
	prepareChangeLabelParams
} from '../../utils/mailUtils';
import { mailContract } from '../../contracts/abi/mailDetails';

const EmailState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (address) => {
		setLoading();
		const userDetails = await getUserDetails(address);

		if (!userDetails["data"]["account"]) {
			setUserNotFound();
			setDisplayMessage(`No Account Found for ${address}. Click on Create Account, or disconnect wallet to exit.`);
			return; // User Not Found
		}
		setUserExists();
		setDisplayMessage("Account Found. Fetching User Keys From IPFS. Could take upto 1-2 min...");
		const cid = userDetails["data"]["account"]["keyCID"];
		let keys;
		try {
			keys = JSON.parse(await fetchKeys(address, cid));
		} catch (e) {
			setDisplayMessage("Error Fetching Account Keys. Please re-try");
			clearLoading();
			return;
		}
		console.log('User Logged In');

		let allCIDs = groupCIDByList(userDetails['data']['account']);

		const credits = userDetails['data']['account']['credits'];
		setDisplayMessage('User Logged In');

		dispatch({
			type: "LOGIN_USER",
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			credits: credits,
			allCIDs: { ...allCIDs }			
		});
	};

	const groupCIDByList = (userAccount) => {
		let allCIDs = {
			"INBOX":[],
			"COLLECT":[],
			"SUBSCRIPTIONS": [],
			"SENT": [...userAccount['mailsSent']],
			"SPAM": []
		};

		userAccount['inbox'].forEach( (message) => {
			allCIDs[message.receiverLabel].push({...message})
		});
		return allCIDs;
	}

	const getMessages = async (listId) => {
		const messageCIDs = [...state.allCIDs[listId]];
		let fileLabel = 'inbox';
		if (listId === "SENT") {
			fileLabel = 'sent';
		}
		let messages = await Promise.all(messageCIDs.map( async (message) => {
			const messageId = message['id'];
			if (state.messageCache[messageId]) {
				return { ...message, mailObject: state.messageCache[messageId]['mailObject']}
			} else {
				try {
				const messageData = await getMail(message, state.userKeys, fileLabel);
				// Update Message Cachce
				dispatch({
					type: 'CACHE_MESSAGE',
					messageId: messageId,
					messageData: messageData,
				});
				return messageData;
				} catch (e) {
					console.log(e);
					return message;
				}
			}
		}));
		return messages;
	};

	const refreshUserData = async () => {
		const userDetails = await getUserDetails(state.loggedInUser);
		if (!userDetails['data']['account']) {
			return;
		}

		let allCIDs = groupCIDByList(userDetails['data']['account']);
		const credits = userDetails['data']['account']['credits'];

		dispatch({
			type: "REFRESH_CID",
			allCIDs: { ...allCIDs },
			credits: credits
		});

		if(!state.refreshingMessages) {
			const messages = await getMessages(state.activeList);
			dispatch({
				type: "REFRESH_MESSAGES",
				messages: messages,
			});

		}
	};

	const setActiveList = async (listId) => {
		setLoading();
		setRefreshingMail(true);
		const messages = await getMessages(listId);
		dispatch({
			type: "SET_ACTIVE_LIST",
			list: listId,
			messages: messages,
		});
	};

	const setRefreshingMail = (refreshingState) => dispatch({ type: "SET_REFRESHING_MESSAGES", refreshingState });

	const setMessage = (message) => dispatch({ type: "SET_MESSAGE", payload: message });

	const clearMessages = () => dispatch({ type: "CLEAR_MESSAGES" });

	const createUser = async (address, contract) => {
		setLoading();
		setDisplayMessage('Creating User Account');
		let newUserDetails;
		try {
			newUserDetails = await createAccount(address, setDisplayMessage);
		} catch (e) {
			setDisplayMessage('Error Creating Account. Please re-try..')
			clearLoading();
			return;
		}

		setDisplayMessage('Storing New User Details on Blockchain..')
		try {
			await emitCreateAccount(newUserDetails.address, newUserDetails.keyCID, contract);
		} catch (e) {
			console.log(e);
			// Emit Event with address, and the CID	
			setDisplayMessage('Error Confirming Txn in Blockchain. Please check for success in 2 mins or retry.')
			clearLoading();
			return;
		}

		setDisplayMessage('New User Account Created');
		dispatch({
			type: "NEW_USER",
			loggedInUser: newUserDetails.address,
			keyCID: newUserDetails.keyCID,
			keys: newUserDetails.keys,
		});
	};

	const createUserGasless = async (address, web3Provider) => {
		setLoading();
		setDisplayMessage("Creating User Account");
		let newUserDetails;
		let txHash = "";
		let transactionComplete = false;
		let res = null;

		try {
			newUserDetails = await prepareAccountFile(address, setDisplayMessage);
		} catch (e) {
			setDisplayMessage("Error Creating Account. Please re-try..");
			clearLoading();
			return;
		}
		setDisplayMessage("Sign your newly created account..");
		const { calldata, signature } = await prepareEmitAccountParams(address, newUserDetails.keyCID, web3Provider);
		setDisplayMessage("Storing account details on Blockchain..");
		try {
			txHash = await emitToRelayer(
				address,
				calldata,
				signature,
				mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address
			);
		} catch (e) {
			console.log(e);
			// Emit Event with address, and the CID
			setDisplayMessage("Error Confirming Txn in Blockchain. Please check for success in 2 mins or retry.");
			clearLoading();
			return;
		}

		setDisplayMessage("Waiting for tx to complete - tx hash: " + txHash);

		while (!transactionComplete) {
			transactionComplete = await isTransactionComplete(txHash);
			await sleep(2000);
		}

		setDisplayMessage("New User Account Created");
		dispatch({
			type: "NEW_USER",
			loggedInUser: newUserDetails.address,
			keyCID: newUserDetails.keyCID,
			keys: newUserDetails.keys,
		});
	};

	const sendMailGasless = async (mailObject, web3Provider, toast) => {
		const receiver = mailObject["to"];
		let dataCID = "";
		let txHash = "";
		let transactionComplete = false;
		let res = null;

		toast({
			title: "Processing Mail.",
			description: "Encrypting Mail...",
			status: "info",
			duration: 3000,
			isClosable: true,
		});

		try{
			dataCID = await prepareMailFile(mailObject, state.userKeys["publicKey"]);
			toast({
				title: "Processing Mail.",
				description: "Please sign the encrypted mail...",
				status: "info",
				duration: 3000,
				isClosable: true,
			});
		} catch {
			return {
				error: true,
				message: "Error pushing message to IPFS, please try again.",
			};
			return;
		}
		
		const { calldata, signature } = await prepareEmitMailParams(mailObject, dataCID, web3Provider);
		toast({
			title: "Processing Mail.",
			description: "Emiting mail to the blockchain...",
			status: "info",
			duration: 3000,
			isClosable: true,
		});
		try {
			txHash = await emitToRelayer(
				state.loggedInUser,
				calldata,
				signature,
				mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address
			);
		} catch (err) {
			return {
				error: true,
				message: "Error pushing message to chain, please try again.",
			};
		}


		while (!transactionComplete) {
			toast({
				title: "Processing Mail.",
				description: "Transaction is being processed tx hash: " + txHash + "...",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
			transactionComplete = await isTransactionComplete(txHash);
			
			await sleep(2000);
		}

		return { error: false, message: "Mail has been submitted !" };
	}

	const sendMail = async (mailObject, contract) => {
		const receiver = mailObject["to"];
		const dataCID = await prepareMailFile(mailObject, state.userKeys["publicKey"]);
		await emitSendMail(state.loggedInUser, receiver, dataCID, mailObject['credits'], contract);
	};

	const updateAddressLabel = async (fromAddress, newLabel, contract) => {
		await emitChangeLabel(fromAddress, state.loggedInUser , newLabel, contract);
	};

	const updateAddressLabelGasless = async (fromAddress, newLabel, web3Provider, toast) => {
		const {calldata, signature} = await prepareChangeLabelParams(fromAddress, state.loggedInUser , newLabel, web3Provider);

		try {
			txHash = await emitToRelayer(
				state.loggedInUser,
				calldata,
				signature,
				mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address
			);
		} catch (err) {
			return {
				error: true,
				message: "Error pushing message to chain, please try again.",
			};
		}


		while (!transactionComplete) {
			toast({
				title: "Processing Mail.",
				description: "Transaction is being processed tx hash: " + txHash + "...",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
			transactionComplete = await isTransactionComplete(txHash);
			
			await sleep(2000);
		}
	};

	const handleActionOnMail = async (message, action, contract) => {
		const from = message['from']['accountAddress']
		const dataCID = message['dataCID']
		await emitMailAction(from, state.loggedInUser, dataCID, action, contract);
	};

	const handleActionOnMailGasless = async (message, action, web3Provider, toast) => {
		const from = message['from']['accountAddress']
		const dataCID = message['dataCID']
		const {calldata, signature} = await prepareMailActionParams(from, state.loggedInUser, dataCID, action, web3Provider);

		try {
			txHash = await emitToRelayer(
				state.loggedInUser,
				calldata,
				signature,
				mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address
			);
		} catch (err) {
			return {
				error: true,
				message: "Error pushing message to chain, please try again.",
			};
		}


		while (!transactionComplete) {
			toast({
				title: "Processing Mail.",
				description: "Transaction is being processed tx hash: " + txHash + "...",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
			transactionComplete = await isTransactionComplete(txHash);
			
			await sleep(2000);
		}
	};

	const setUserNotFound = () => dispatch({ type: "USER_NOT_FOUND" });

	const resetUser = () => dispatch({ type: "RESET_USER" });
	const setUserExists = () => dispatch({ type: "SET_USER_EXISTS" });
	const setLoading = () => dispatch({ type: "SET_LOADING" });
	const clearLoading = () => dispatch({ type: "CLEAR_LOADING" });
	const toogleGasMode = () => dispatch({type: "TOOGLE_GAS_MODE", isGasless: !state.isGasless});

	const setDisplayMessage = (message) => dispatch({ type: "SET_DISPLAY_MESSAGE", payload: message });

	return (
		<UserContext.Provider
			value={{
				userExists: state.userExists,
				userLoading: state.userLoading,
				loggedInUser: state.loggedInUser,
				userCredits: state.userCredits,
				activeList: state.activeList,
				messages: state.messages,
				message: state.message,
				userDisplayMessage: state.userDisplayMessage,
				loginUser: loginUser,
				resetUser: resetUser,
				createUser: createUser,
				setMessage: setMessage,
				setActiveList: setActiveList,
				sendMail: sendMail,
				refreshUserData: refreshUserData,
				updateAddressLabel: updateAddressLabel,
				handleActionOnMail: handleActionOnMail,
				toogleGasMode: toogleGasMode,
				isGasless: state.isGasless,
				sendMailGasless: sendMailGasless,
				handleActionOnMailGasless: handleActionOnMailGasless,
				updateAddressLabelGasless: updateAddressLabelGasless
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default EmailState;
