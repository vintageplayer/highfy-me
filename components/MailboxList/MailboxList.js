import { useContext, useEffect, useState } from "react";
import { Button, Box, List, ListItem, Flex } from "@chakra-ui/core";
import { MdLabel, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";
import { BsCurrencyDollar, BsCollection } from "react-icons/bs";
import SendModel from "./SendModel";
import ChangeLabelModel from "./ChangeLabelModel";
import UserContext from "../../context/user/UserContext";
import Web3Context from "../../context/web3/Web3Context";

export default function Main({ address }) {
	const { userLoading, loggedInUser, activeList, setActiveList, sendMail, updateAddressLabel, refreshingMessages } = useContext(UserContext);
	const { contract } = useContext(Web3Context);

	const selectMailList = async (e) => {
		const listId = e.target.id;
		if (listId !== activeList && !userLoading) {
			await setActiveList(listId);
		}
	};

	return (
		<Box w="16%" h="100%" bg="white" border="1px" borderColor="gray.200" borderTopLeftRadius="md" borderBottomLeftRadius="md">
			<List>
				{/* Send Model */}
				<ListItem p="0.5rem 1rem 1rem">
					<SendModel
						loggedInUser={loggedInUser}
						contract={contract}
						sendMail={sendMail}
					/>
				</ListItem>

				{/* Labels Buttons */}
				<ListItem disable="true">
					<Button
						id="INBOX"
						w="100%"
						h="45px"
						py={2}
						pl={8}
						leftIcon={MdInbox}
						variantColor="blue"
						variant={activeList === "INBOX" ? "solid" : "ghost"}
						justifyContent="flex-start"
						onClick={selectMailList}
						isDisabled={refreshingMessages}
					>
						Inbox
					</Button>
				</ListItem>
				<ListItem>
					<Button
						id="COLLECT"
						w="100%"
						h="45px"
						py={2}
						pl={8}
						leftIcon={BsCurrencyDollar}
						variantColor="blue"
						variant={activeList === "COLLECT" ? "solid" : "ghost"}
						justifyContent="flex-start"
						onClick={selectMailList}
						isDisabled={refreshingMessages}
					>
						Collect
					</Button>
				</ListItem>
				<ListItem>
					<Button
						id="SUBSCRIPTIONS"
						w="100%"
						h="45px"
						py={2}
						pl={8}
						leftIcon={BsCollection}
						variantColor="blue"
						variant={activeList === "SUBSCRIPTIONS" ? "solid" : "ghost"}
						justifyContent="flxex-start"
						onClick={selectMailList}
						isDisabled={refreshingMessages}
					>
						Subscriptions
					</Button>
				</ListItem>
				<ListItem>
					<Button
						id="SENT"
						w="100%"
						h="45px"
						py={2}
						pl={8}
						leftIcon={FiSend}
						variantColor="blue"
						variant={activeList === "SENT" ? "solid" : "ghost"}
						justifyContent="flex-start"
						onClick={selectMailList}
						isDisabled={refreshingMessages}
					>
						Sent
					</Button>
				</ListItem>
				<ListItem>
					<Button
						id="SPAM"
						w="100%"
						h="45px"
						py={2}
						pl={8}
						leftIcon={MdLoyalty}
						variantColor="blue"
						variant={activeList === "SPAM" ? "solid" : "ghost"}
						justifyContent="flxex-start"
						onClick={selectMailList}
						isDisabled={refreshingMessages}
					>
						Spam
					</Button>
				</ListItem>
				{/* Manage Address Label */}
				<ListItem p="0.5rem 1rem 1rem">
					<ChangeLabelModel
						loggedInUser={loggedInUser}
						contract={contract}
						updateAddressLabel={updateAddressLabel}
					/>
				</ListItem>
			</List>
		</Box>
	);
}
