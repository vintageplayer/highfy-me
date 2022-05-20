import UserContext from "./UserContext";
import { useReducer } from "react";
import UserReducer, { initialState } from "./UserReducer";
import {
	prepareAccountFile,
	prepareEmitAccountParams,
	getUserDetails,
	fetchKeys,
	getMails,
	prepareMailFile,
	emitToRelayer,
	prepareEmitMailParams,
	isTransactionComplete
} from "../../utils/mailUtils";
import { mailContract } from "../../contracts/abi/mailDetails";

const EmailState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (address) => {
		setLoading();
		const userDetails = await getUserDetails(address);
		if (!userDetails["data"]["account"]) {
			setUserNotFound();
			return; // User Not Found
		}
		const cid = userDetails["data"]["account"]["keyCID"];
		const keys = JSON.parse(await fetchKeys(address, cid));
		console.log("User Logged In");
		const inboxCIDs = userDetails["data"]["account"]["inbox"];
		const sentCIDs = userDetails["data"]["account"]["mailsSent"];

		dispatch({
			type: "LOGIN_USER",
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			allCIDs: { ...state.allCIDs, INBOX: inboxCIDs, SENT: sentCIDs },
			// allMails: {...state.allMails, "INBOX": inboxMessages, "SENT": sentMessages}
		});
	};

	const getMessages = async (listId) => {
		if (listId === "INBOX") {
			return await getMails(state.allCIDs["INBOX"], state.userKeys, "inbox");
		} else if (listId === "SENT") {
			return await getMails(state.allCIDs["SENT"], state.userKeys, "sent");
		} else {
			return [];
		}
	};

	const setActiveList = async (listId) => {
		setLoading();
		const messages = await getMessages(listId);
		dispatch({
			type: "SET_ACTIVE_LIST",
			list: listId,
			messages: messages,
		});
	};

	const setMessage = (message) => dispatch({ type: "SET_MESSAGE", payload: message });

	const clearMessages = () => dispatch({ type: "CLEAR_MESSAGES" });

	const createUser = async (address, web3Provider, toast) => {
		setLoading();
		let newUserDetails;
		let txHash = "";
		let transactionComplete = false;
		let res = null;

		try {
			newUserDetails = await prepareAccountFile(address);
		} catch (err) {
			return { error: true, message: "Please try again , failed to upload your keys to IPFS" };
		}

		const { calldata, signature } = await prepareEmitAccountParams(address, newUserDetails.keyCID, web3Provider);

		try {
			txHash = await emitToRelayer(address, calldata, signature, mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address)
		} catch (err) {
			return { error: true, message: "Transaction has been submitted to the block, please check in a few minutes" };
		}

		console.log('Waiting for tx to complete - tx hash: '+ txHash);

		while(!transactionComplete) {
			transactionComplete = await isTransactionComplete(txHash);
			console.log(transactionComplete);
			await sleep(2000);
		}

		dispatch({
			type: 'NEW_USER',
			loggedInUser: newUserDetails.address,
			keyCID: newUserDetails.keyCID,
			keys: newUserDetails.keys
		});
	};

	const setUserNotFound = () => dispatch({ type: "USER_NOT_FOUND" });

	const resetUser = () => dispatch({ type: "RESET_USER" });

	const setLoading = () => dispatch({ type: "SET_LOADING" });

	const sendMail = async (mailObject, web3Provider, toast) => {
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

		dataCID = await prepareMailFile(mailObject, state.userKeys["publicKey"]);

		toast({
	        title: "Processing Mail.",
	        description: "Please sign the encrypted mail...",
	        status: "info",
	        duration: 3000,
	        isClosable: true,
	      });
		const { calldata, signature } = await prepareEmitMailParams(mailObject, dataCID, web3Provider);
		toast({
	        title: "Processing Mail.",
	        description: "Emiting mail to the blockchain...",
	        status: "info",
	        duration: 3000,
	        isClosable: true,
	      });
		try {
			txHash = 
				await emitToRelayer(
					state.loggedInUser,
					calldata,
					signature,
					mailContract.networks[process.env.NEXT_PUBLIC_MAIL_NETWORK].address
				);
		} catch (err) {
			return {
				error: true,
				message: "Transaction has been submitted to the chain , please check in some time for confirmation.",
			};
		}

		toast({
	        title: "Processing Mail.",
	        description: "Transaction is being processed tx hash: "+txHash+"...",
	        status: "info",
	        duration: 3000,
	        isClosable: true,
	      });

		while(!transactionComplete) {
			transactionComplete = await isTransactionComplete(txHash);
			console.log(transactionComplete);
			await sleep(2000);
		}

		return { error: false, message: "Mail has been submitted !" };
	};

	return (
		<UserContext.Provider
			value={{
				userExists: state.userExists,
				userLoading: state.userLoading,
				loggedInUser: state.loggedInUser,
				activeList: state.activeList,
				messages: state.messages,
				message: state.message,
				loginUser: loginUser,
				resetUser: resetUser,
				createUser: createUser,
				setMessage: setMessage,
				setActiveList: setActiveList,
				getMessages: getMessages,
				sendMail: sendMail,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default EmailState;

const timeout = async (p, ms) => Promise.race([p, new Promise((_, r) => sleep(ms).then((_) => r(Error("timeout"))))]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
