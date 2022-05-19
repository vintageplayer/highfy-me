import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import {createAccount, getUserDetails, fetchKeys, getMails, prepareMailFile, emitCreateAccount, emitSendMail} from '../../utils/mailUtils'

const EmailState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (address) => {
		setLoading();		
		const userDetails = await getUserDetails(address);
		if (!userDetails['data']['account']) {
			setUserNotFound()
			setDisplayMessage(`No Account Found for ${address}. Click on Create Account, or disconnect wallet to exit.`)
			return // User Not Found
		}
		setUserExists()
		setDisplayMessage('Account Found. Fetching User Keys From IPFS. Could take upto 1-2 min...')
		const cid = userDetails['data']['account']['keyCID'];
		let keys;
		try {
			keys = JSON.parse(await fetchKeys(address, cid));
		} catch (e) {
			setDisplayMessage('Error Fetching Account Keys. Please re-try');
			clearLoading();
			return;
		}
		console.log('User Logged In');
		const inboxCIDs= userDetails['data']['account']['inbox'];
		const sentCIDs= userDetails['data']['account']['mailsSent'];
		setDisplayMessage('User Logged In')
		dispatch({
			type: 'LOGIN_USER',
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			allCIDs: {...state.allCIDs, "INBOX": inboxCIDs, "SENT": sentCIDs}
			// allMails: {...state.allMails, "INBOX": inboxMessages, "SENT": sentMessages}
		});
	}

	const getMessages = async (listId) => {
		if (listId === 'INBOX'){
			return await getMails(state.allCIDs['INBOX'], state.userKeys, 'inbox');
		} else if(listId === 'SENT') {
			return await getMails(state.allCIDs['SENT'], state.userKeys, 'sent');
		} else {
			return [];
		}
	}

	const setActiveList = async (listId) => {
		setLoading();
		const messages = await getMessages(listId);
		dispatch({
			type: 'SET_ACTIVE_LIST',
			list: listId,
			messages: messages
		});
	} 

	const setMessage = (message) => dispatch({ type: 'SET_MESSAGE', payload: message});

	const clearMessages = () => dispatch({ type: 'CLEAR_MESSAGES' });

	const createUser = async(address, contract) => {
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
			type: 'NEW_USER',
			loggedInUser: newUserDetails.address,
			keyCID: newUserDetails.keyCID,
			keys: newUserDetails.keys
		});
	}	

	const setUserNotFound = () => dispatch({ type: 'USER_NOT_FOUND' });

	const resetUser = () => dispatch({ type: 'RESET_USER' });	
	const setUserExists = () => dispatch({ type: 'SET_USER_EXISTS' });
	const setLoading = () => dispatch({ type: 'SET_LOADING' });
	const clearLoading = () => dispatch({ type: 'CLEAR_LOADING' });

	const sendMail = async (mailObject, contract, web3Provider) => {
		const receiver = mailObject['to'];
		const dataCID = await prepareMailFile(mailObject, state.userKeys['publicKey']);
		await emitSendMail(state.loggedInUser, receiver, dataCID, contract)
	}

	const setDisplayMessage = (message) => dispatch({ type: 'SET_DISPLAY_MESSAGE', payload: message });

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
				sendMail: sendMail
			}}
		>
			{props.children}
		</UserContext.Provider>
		)
}

export default EmailState;