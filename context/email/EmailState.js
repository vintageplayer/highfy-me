import EmailContext from "./emailContext";

const EmailState = (props) => {
	return (
		<EmailContext.Provider
			value={{}}
		>
			{props.children}
		</EmailContext.Provider>
		)
}

export default EmailState;