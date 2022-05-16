import {useEffect, useContext} from 'react';
import { Flex } from "@chakra-ui/core";
import MailboxList from "./MailboxList/MailboxList";
import EmailList from "./EmailList/EmailList";
import Email from "./Email/Email";
import UserContext from "../context/user/UserContext";

export default function Main ({address}) {
	const {setActiveList, loggedInUser} = useContext(UserContext);

	useEffect(() => {
		setActiveList("INBOX");
	}, [loggedInUser]);
	
	return (
	    <Flex
	      h='100vh'
	      minH='600px'
	      justify='space-arround'
	      wrap='no-wrap'
	      p='1em'
	      bg='#e5f4f1'
	      color='white'
	    >
	      <MailboxList />
	      <EmailList />
	      <Email />
	    </Flex>
	);
}