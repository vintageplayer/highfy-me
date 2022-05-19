export const initialState = {
	userExists: false,
	userLoading: false,
	loggedInUser: null,
	refreshingMessages: false,
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
		case 'REFRESH_CID':
			return {
				...state,
				allCIDs: {...state.allCIDs, INBOX: action.allCIDs['INBOX'], SENT: action.allCIDs['SENT']}
			}
		case 'REFRESH_MESSAGES':
			console.log('refreshing messages', action.messages);
			return {
				...state,
				messages: action.messages
			}
		case 'SET_REFRESHING_MESSAGES':
			return {
				...state,
				refreshingMessages: action.refreshingState
			}
		default:
			return state;
	}
}