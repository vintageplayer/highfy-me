import MailboxList from "./MailboxList/MailboxList";
import { Flex } from "@chakra-ui/core";

export default function Main ({address}) {

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
	    </Flex>
	);
}