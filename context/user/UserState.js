import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import {createAccount, getUserDetails, fetchKeys, getMails, prepareMailFile, emitSendMail, prepareEmitMailParams} from '../../utils/mailUtils'

const EmailState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (address) => {
		setLoading();
		const userDetails = await getUserDetails(address);
		if (!userDetails['data']['account']) {
			setUserNotFound()
			return // User Not Found
		}
		const cid = userDetails['data']['account']['keyCID'];
		const keys = JSON.parse(await fetchKeys(address, cid));
		console.log('User Logged In');
		const inboxCIDs= userDetails['data']['account']['inbox'];
		const sentCIDs= userDetails['data']['account']['mailsSent'];

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
		const newUserDetails = await createAccount(address, contract);
		dispatch({
			type: 'NEW_USER',
			loggedInUser: newUserDetails.address,
			keyCID: newUserDetails.keyCID,
			keys: newUserDetails.keys
		});
	}	

	const setUserNotFound = () => dispatch({ type: 'USER_NOT_FOUND' });

	const resetUser = () => dispatch({ type: 'RESET_USER' });

	const setLoading = () => dispatch({ type: 'SET_LOADING' });

	const sendMail = async (mailObject, contract, web3Provider) => {
		const receiver = mailObject['to'];
		console.log('preparing mail file');
		const dataCID = await prepareMailFile(mailObject, state.userKeys['publicKey']);
		console.log('preparing emit email params file');
		const { calldata, signature } = await prepareEmitMailParams(mailObject['from'], mailObject['to'], dataCID, web3Provider);
		console.log('emiting email')
		await emitSendMail(state.loggedInUser, calldata, signature, contract._address)
	}

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
				sendMail: sendMail
			}}
		>
			{props.children}
		</UserContext.Provider>
		)
}

export default EmailState;