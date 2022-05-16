export const initialState = {
	userExists: false,
	userLoading: false,
	loggedInUser: null,
	keyCID: null,
	userKeys: null,
	messages: [],
	message: null,
	currentLabel: "INBOX",
	allCIDs: {"INBOX":[], "COLLECT":[], "SUBSCRIPTIONS": [], "SENT":[], "SPAM": []},
	allMails: {"INBOX":[], "COLLECT":[], "SUBSCRIPTIONS": [], "SENT":[], "SPAM": []}
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
				messages: action.allMails["INBOX"],
				message: null,
				currentLabel: "INBOX",
				allCIDs: action.allCIDs,
				allMails: action.allMails
			}
		case 'SET_CURRENT_LABEL':
			return {
				...state,
				currentLabel: action.currentLabel,
				messages: allMails[action.currentLabel],
				message: null
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload
			}
		case 'CLEAR_MESSAGES':
			return {
				...state,
				messages: [],
				message: null
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