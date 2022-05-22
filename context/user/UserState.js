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
	isTransactionComplete,
} from "../../utils/mailUtils";
import { mailContract } from "../../contracts/abi/mailDetails";

// Get items that only occur in the left array,
// using the compareFunction to determine equality.
const onlyInLeft = (left, right, compareFunction) => {
  
  return left.filter(leftValue =>
    !right.some(rightValue => 
      compareFunction(leftValue, rightValue)));
}

// A comparer used to determine if two entries are equal.
const isSameCID = (a, b) => {
	return a.id == b.id;
}


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
		console.log("User Logged In");
		const inboxCIDs = userDetails["data"]["account"]["inbox"];
		const sentCIDs = userDetails["data"]["account"]["mailsSent"];
		setDisplayMessage("User Logged In");

		dispatch({
			type: "LOGIN_USER",
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			allCIDs: { ...state.allCIDs, INBOX: inboxCIDs, SENT: sentCIDs },
			// allMails: {...state.allMails, "INBOX": inboxMessages, "SENT": sentMessages}
		});
	};

	const getMessages = async (listId, allCIDs, isRefresh) => {
		let newerMails = []
		
		if (listId != "") {
			if (!isRefresh) return await getMails(state.allCIDs[listId], state.userKeys, listId);
			newerMails = onlyInLeft(allCIDs[listId], state.allCIDs[listId], isSameCID);
			if (newerMails == null) return [];
			return await getMails(newerMails, state.userKeys, listId.toLowerCase());
		} else {
			return [];
		}
	};

	const refreshUserData = async () => {
		const userDetails = await getUserDetails(state.loggedInUser);
		const inboxCIDs = userDetails["data"]["account"]["inbox"];
		const sentCIDs = userDetails["data"]["account"]["mailsSent"];
		const latestCIDlist = { ...state.allCIDs, INBOX: inboxCIDs, SENT: sentCIDs }

		if (!state.refreshingMessages) {
			const messages = await getMessages(state.activeList, latestCIDlist, true);
			dispatch({
				type: "REFRESH_MESSAGES",
				messages: [...state.messages,...messages],
			});
		}

		dispatch({
			type: "REFRESH_CID",
			allCIDs: latestCIDlist,
		});
	};

	const setActiveList = async (listId) => {
		setLoading();
		setRefreshingMail(true);
		const messages = await getMessages(listId, state.allCIDs, false);
		dispatch({
			type: "SET_ACTIVE_LIST",
			list: listId,
			messages: messages,
		});
	};

	const setRefreshingMail = (refreshingState) => dispatch({ type: "SET_REFRESHING_MESSAGES", refreshingState });

	const setMessage = (message) => dispatch({ type: "SET_MESSAGE", payload: message });

	const clearMessages = () => dispatch({ type: "CLEAR_MESSAGES" });

	const createUser = async (address, web3Provider) => {
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
	};

	const setUserNotFound = () => dispatch({ type: "USER_NOT_FOUND" });

	const resetUser = () => dispatch({ type: "RESET_USER" });
	const setUserExists = () => dispatch({ type: "SET_USER_EXISTS" });
	const setLoading = () => dispatch({ type: "SET_LOADING" });
	const clearLoading = () => dispatch({ type: "CLEAR_LOADING" });

	const setDisplayMessage = (message) => dispatch({ type: "SET_DISPLAY_MESSAGE", payload: message });

	return (
		<UserContext.Provider
			value={{
				userExists: state.userExists,
				userLoading: state.userLoading,
				loggedInUser: state.loggedInUser,
				activeList: state.activeList,
				messages: state.messages,
				message: state.message,
				userDisplayMessage: state.userDisplayMessage,
				loginUser: loginUser,
				resetUser: resetUser,
				createUser: createUser,
				setMessage: setMessage,
				setActiveList: setActiveList,
				getMessages: getMessages,
				sendMail: sendMail,
				refreshUserData: refreshUserData,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default EmailState;
