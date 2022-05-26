import {useEffect, useContext, useRef} from 'react';
import { Flex } from "@chakra-ui/core";
import MailboxList from "./MailboxList/MailboxList";
import EmailList from "./EmailList/EmailList";
import Email from "./Email/Email";
import UserContext from "../context/user/UserContext";

export default function Main ({address}) {
	const {setActiveList, loggedInUser, refreshMessages, activeList, allCIDs, refreshUserData} = useContext(UserContext);

	useEffect(() => {
		setActiveList("INBOX");
	}, [loggedInUser]);

	useInterval( async () => {
		await refreshUserData();
	  }, 40000);
	
	return (
	    <Flex
	      h='95vh'
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

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}