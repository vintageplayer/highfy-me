import {useContext} from 'react';
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";
import SendModel from "./SendModel";
import UserContext from "../../context/user/UserContext";
import Web3Context from "../../context/web3/Web3Context";

export default function Main ({address}) {
	const {userLoading ,loggedInUser, activeList, setActiveList, sendMail } = useContext(UserContext);
	const {contract, web3Provider} = useContext(Web3Context);

	const selectMailList = async (e) => {
		const listId = e.target.id;
		if (listId !== activeList && !userLoading) {
			await setActiveList(listId);
		}
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
	          <SendModel loggedInUser={loggedInUser} contract={contract} sendMail={sendMail} web3Provider={web3Provider} />
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
	            variant={activeList === "INBOX" ? "solid" : "ghost"}
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
	            variant={activeList === "COLLECT" ? "solid" : "ghost"}
	            justifyContent='flex-start'
	            onClick={selectMailList}
	          >
	            Collect
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='SUBSCRIPTIONS'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdPeople}
	            variantColor='blue'
	            variant={activeList === "SUBSCRIPTIONS" ? "solid" : "ghost"}
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
	            variant={activeList === "SENT" ? "solid" : "ghost"}
	            justifyContent='flex-start'
	            onClick={selectMailList}
	          >
	            Sent
	          </Button>
	        </ListItem>
	        <ListItem>
	          <Button
	            id='SPAM'
	            w='100%'
	            h='45px'
	            py={2}
	            pl={8}
	            leftIcon={MdLoyalty}
	            variantColor='blue'
	            variant={activeList === "SPAM" ? "solid" : "ghost"}
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