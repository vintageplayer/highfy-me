import {useState} from 'react';
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";

export default function Main ({address}) {
	const [active, setActive] = useState("INBOX");

	const selectMailList = (e) => {
		const categoryId = e.target.id;
		setActive(categoryId);
	}

	return (
		<Box
	      w='16%'
	      h='100%'
	      bg='white'
	      border='1px'
	      borderColor='gray.200'
	      borderTopLeftRadius='md'
	      borderBottomLeftRadius='md'
	    >
	      <List>
	        {/* Send Model */}
	        <ListItem p='0.5rem 1rem 1rem'>
	          {/*<SendModel />*/}
	        </ListItem>

	        {/* Labels Buttons */}
	        <ListItem>
	          <Button
	            id='INBOX'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdInbox}
	            variantColor='blue'
	            variant={active === "INBOX" ? "solid" : "ghost"}
	            justifyContent='flex-start'
	            onClick={selectMailList}
	          >
	            Inbox
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='COLLECT'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdStar}
	            variantColor='blue'
	            variant={active === "COLLECT" ? "solid" : "ghost"}
	            justifyContent='flex-start'
	            onClick={selectMailList}
	          >
	            Collect
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='CATEGORY_SUBSCRIPTIONS'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdPeople}
	            variantColor='blue'
	            variant={active === "CATEGORY_SUBSCRIPTIONS" ? "solid" : "ghost"}
	            justifyContent='flxex-start'
	            onClick={selectMailList}
	          >
	            Subscriptions
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='SENT'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={FiSend}
	            variantColor='blue'
	            variant={active === "SENT" ? "solid" : "ghost"}
	            justifyContent='flex-start'
	            onClick={selectMailList}
	          >
	            Sent
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='CATEGORY_SPAM'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdLoyalty}
	            variantColor='blue'
	            variant={active === "CATEGORY_SPAM" ? "solid" : "ghost"}
	            justifyContent='flxex-start'
	            onClick={selectMailList}
	          >
	            Spam
	          </Button>
	        </ListItem>
	      </List>
	    </Box>
	);
}