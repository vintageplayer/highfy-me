export const initialState = {
	userExists: false,
	userLoading: false,
	loggedInUser: null,
	refreshingMessages: false,
	keyCID: null,
	userKeys: null,
	userCredits: 0,
	messages: [],
	message: null,
	activeList: "INBOX",
	allCIDs: {"INBOX":[], "COLLECT":[], "SUBSCRIPTIONS": [], "SENT":[], "SPAM": []},
	allMails: {"INBOX":[], "COLLECT":[], "SUBSCRIPTIONS": [], "SENT":[], "SPAM": []},
	userDisplayMessage: 'Checking Account Details',
	isGasless: true,
	messageCache: {}
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
				userCredits: action.credits,
				message: null,
				activeLabel: "INBOX",
				allCIDs: action.allCIDs
			}
		case 'SET_ACTIVE_LIST':
			return {
				...state,
				activeList: action.list,
				messages: action.messages,
				message: null,
				userLoading: false,
				refreshingMessages: false
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload,
				userLoading: false
			}
		case 'CLEAR_MESSAGES':
			return {
				...state,
				messages: [],
				message: null
			}
		case 'SET_USER_EXISTS':
			return {
				...state,
				userExists: true
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
				userKeys: action.keys,
				message: null,
				activeLabel: "INBOX",
				userDisplayMessage: 'User Logged In'
			}
		case 'SET_LOADING':
			return {
				...state,
				userLoading: true
			}
		case 'CLEAR_LOADING':
			return {
				...state,
				userLoading: false
			}
		case 'SET_DISPLAY_MESSAGE':
			return {
				...state,
				userDisplayMessage: action.payload
			}
		case 'RESET_USER':
			return initialState
		case 'REFRESH_CID':
			return {
				...state,
				allCIDs: {...action.allCIDs},
				userCredits: action.credits
			}
		case 'REFRESH_MESSAGES':
			return {
				...state,
				messages: action.messages
			}
		case 'CACHE_MESSAGE':
			let newCache = {...state.messageCache};
			newCache[action.messageId] = action.messageData;
			return {
				...state,
				messageCache: {...newCache}
			}
		case 'SET_REFRESHING_MESSAGES':
			return {
				...state,
				refreshingMessages: action.refreshingState
			}
		case 'TOOGLE_GAS_MODE':
			return {
				...state,
				isGasless: action.isGasless
			}
		default:
			return state;
	}
}