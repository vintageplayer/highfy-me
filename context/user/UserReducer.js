export const initialState = {
	userExists: false,
	userLoading: false,
	loggedInUser: null,
	keyCID: null,
	userKeys: null,
	messages: [],
	message: null,
	activeList: "INBOX",
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
				message: null,
				activeLabel: "INBOX",
				allCIDs: action.allCIDs
				// allMails: action.allMails
			}
		case 'SET_ACTIVE_LIST':
			return {
				...state,
				activeList: action.payload,
				messages: [],
				message: null
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload,
				userLoading: false
			}
		case 'SET_MESSAGES':
			return {
				...state,
				messages: action.payload,
				userLoading: false
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
		case 'NEW_USER':
			return {
				...state,
				userExists: true,
				userLoading: false,
				loggedInUser: action.loggedInUser,
				keyCID: action.keyCID,
				keys: action.keys
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