import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import {createAccount, getUserDetails, fetchKeys, getMails} from '../../utils/mailUtils'

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
		const keys = await fetchKeys(address, cid);
		console.log('User Logged In');
		const inboxCIDs= userDetails['data']['account']['inbox'];
		const sentCIDs= userDetails['data']['account']['mailsSent'];
		const inboxMessages = await getMails(userDetails['data']['account']['inbox'], keys, 'inbox');
		const sentMessages = await getMails(userDetails['data']['account']['mailsSent'], keys, 'sent');

		dispatch({
			type: 'LOGIN_USER',
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			allCIDs: {...state.allCIDs, "INBOX": inboxCIDs, "SENT": sentCIDs},
			allMails: {...state.allMails, "INBOX": inboxMessages, "SENT": sentMessages}
		});
	}

	const setActiveList = (listId) => dispatch({ type: 'SET_ACTIVE_LIST', payload: listId });

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
				setActiveList: setActiveList
			}}
		>
			{props.children}
		</UserContext.Provider>
		)
}

export default EmailState;