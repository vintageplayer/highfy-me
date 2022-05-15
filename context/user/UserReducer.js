export const initialState = {
	userExists: true,
	userLoading: false,
	loggedInUser: null,
	keyCID: null,
	userKeys: null,
	inbox: null,
	mailsSent: null
}

export default function UserReducer(state, action) {
	switch(action.type) {
		case 'LOGIN_USER':
			return {
				...state,
				userExists: true,
				userLoading: false,
				loggedInUser: action.loggedInUser,
				keyCID: action.keyCID,
				userKeys: action.keys,
				inbox: action.inbox,
				mailsSent: action.mailsSent
			}
		case 'USER_NOT_FOUND':
			return {
				...state,
				userExists: false,
				userLoading: false
			}
		case 'SET_LOADING':
			return {
				...state,
				userLoading: true
			}
		case 'RESET_USER':
			return initialState
		default:
			return state;
	}
}