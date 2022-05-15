import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import {getUserDetails, fetchKeys} from '../../utils/mailUtils'

const EmailState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (address) => {
		setLoading();
		const userDetails = await getUserDetails(address);
		// const cid = userDetails['data']['account']['keyCID'];
		const cid = null;
		if (!cid) {
			setUserNotFound()
			return // User Not Found
		}
		const keys = await fetchKeys(address, cid);
		console.log('User Logged In');
		dispatch({
			type: 'LOGIN_USER',
			loggedInUser: address,
			keyCID: cid,
			keys: keys,
			inbox: userDetails['data']['account']['inbox'],
			sent: userDetails['data']['account']['mailsSent']			
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
				inbox: state.inbox,
				mailsSent: state.mailsSent,
				loginUser: loginUser,
				resetUser: resetUser
			}}
		>
			{props.children}
		</UserContext.Provider>
		)
}

export default EmailState;