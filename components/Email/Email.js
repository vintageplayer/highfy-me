import EmptyEmail from './EmptyEmail';
import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";
import {useContext, useEffect} from 'react';
import UserContext from '../../context/user/UserContext';

import {
	Flex,
	Button,
	Box,
	Text,
	Avatar,
	AspectRatioBox
} from '@chakra-ui/core';

export default function Email() {
	const { message } = useContext(UserContext);
	useEffect(() => {
		if (message) {
			addToFrame(message);
		}		
	}, [message]);
	const addToFrame = (message) => {
		let ifrm = document.getElementById("messageBodyIframe").contentWindow.document;
		ifrm.body.innerHTML = message.body;
	};

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
		{!message ? (
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
							Subject: {message['subject']}
						</Text>

						<Flex wrap='no-wrap' justify='flex-start'>
							<Avatar
								name={message['from']}
								src='https://bit.ly/tioluwani-kolawole'
								mr={4}
							/>
							<Box w='80%'>
								<Text fontSize='md' color='gray.700'>
									From: {message['from']}
								</Text>
								<Text fontSize='sm' color='gray.500'>
									15-May-2022
								</Text>
							</Box>
						</Flex>
						<Text fontSize='sm' color='gray.700' mt={1}>
							To: {message['to']}
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
			</>
			)
		}		
		</Flex>
	);
}