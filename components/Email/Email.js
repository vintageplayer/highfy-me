import EmptyEmail from './EmptyEmail';
import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";
import {useContext, useEffect} from 'react';
import UserContext from '../../context/user/UserContext';
import Web3Context from "../../context/web3/Web3Context";
import {
	Flex,
	Button,
	Box,
	Text,
	Avatar,
	AspectRatioBox,
	FormControl,
	FormLabel,
	Select,
	Stack,
	useToast
} from '@chakra-ui/core';

export default function Email() {
	const { activeList, message, handleActionOnMail } = useContext(UserContext);
	const { contract } = useContext(Web3Context);
	const toast = useToast();

	useEffect(() => {
		if (message && message['mailObject']) {
			addToFrame(message['mailObject']);
		}		
	}, [message]);
	const addToFrame = (message) => {
		let ifrm = document.getElementById("messageBodyIframe").contentWindow.document;
		ifrm.body.innerHTML = message.body;
	};

	const mainActionHandler = async (e) => {
		e.preventDefault();
		const from = e.target;
		const action = form.elements["mailAction"].value;
	    try {
	      toast({
	        title: "Processing Action On Mail.",
	        description: "Submitting your response to blockchain.",
	        status: "info",
	        duration: 3000,
	        isClosable: true,
	      });
	      await handleActionOnMail(message, action, contract);
	      toast({
	        title: "Response Updated.",
	        description: "Response has been recorded on blockchain.",
	        status: "success",
	        duration: 3000,
	        isClosable: true,
	      });
	    } catch (e) {
	      console.log(e);
	      toast({
	        title: "An error occurred.",
	        description: "Unable to update the mail response.",
	        status: "error",
	        duration: 9000,
	        isClosable: true,
	      });
	    }
	}

	return (
		<Flex
			direction='column'
			wrap='no-wrap'
			w='58%'
			h='100%'
			p='0.6rem 1rem'
			bg='white'
			color='black'
			border='1px'
			borderColor='gray.200'
			borderTopRightRadius='md'
			borderBottomRightRadius='md'
		>
		{(!message)? (
			<EmptyEmail />
			) : (
			<>
				<Flex justify='space-between' wrap='no-wrap' mb={2}>
					<ReplyModel />
					<ForwardModel />
				</Flex>

				{/* Mail Container */}
				<Flex
					flexGrow='2'
					direction='column'
					wrap='no-wrap'
					p={2}
				>
					<Box mb={2}>
						<Text fontSize='lg' fontWeight='bold' color='gray.700' mb={1}>
							Subject: {message['mailObject']['subject']}
						</Text>

						<Flex wrap='no-wrap' justify='flex-start'>
							<Avatar
								name={message['from']['accountAddress']}
								src='https://bit.ly/tioluwani-kolawole'
								mr={4}
							/>
							<Box w='80%'>
								<Text fontSize='md' color='gray.700'>
									From: {message['from']['accountAddress']}
								</Text>
								<Text fontSize='sm' color='gray.500'>
									15-May-2022
								</Text>
							</Box>
						</Flex>
						<Text fontSize='sm' color='gray.700' mt={1}>
							To: {message['to']['accountAddress']}
						</Text>
					</Box>
					<hr />
					<Box flexGrow='2'>
						<AspectRatioBox ratio={16 / 9} h='100%'>
							<Box as='iframe' id='messageBodyIframe' title='messageBody'>
								<p>Your browser does not support iframes</p>
							</Box>
						</AspectRatioBox>
					</Box>
				</Flex>
				{/* Actions on Paid Container */}
				{ (activeList!= 'SENT' && (message['creditStatus'] == "PENDING")) &&
				(<>
					<hr />
					<br />
					<Flex justify='right' wrap='no-wrap' mb={2}>
						<form id='form' onSubmit={mainActionHandler}>
							<Stack isInline="true">
								<FormControl>
									<Select id="mailAction">
										<option value='ACCEPT_MAIL'>Collect & Whitelist</option>
										<option value='REFUND_MAIL'>Refund & Whitelist</option>
										<option value='SPAM_MAIL'>Collect & Mark Spam</option>
									</Select>
								</FormControl>
								<FormControl>
									<Button type='submit' variantColor='green'>
										Submit
									</Button>
								</FormControl>
							</Stack>
						</form>
					</Flex>
				</>)}
			</>
			)
		}		
		</Flex>
	);
}