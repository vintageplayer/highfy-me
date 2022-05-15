import UserContext from "./UserContext";

const EmailState = (props) => {
	return (
		<UserContext.Provider
			value={{}}
		>
			{props.children}
		</UserContext.Provider>
		)
}

export default EmailState;