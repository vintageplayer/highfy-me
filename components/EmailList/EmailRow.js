import {Flex, Avatar, Box, Text} from '@chakra-ui/core';

export default function EmailRow({message, messageIndex, messageClickHandler}) {

	const name = (message && message['from']) ? message['from']['accountAddress'] : '';
	const subject = (message && message['mailObject']) ? message['mailObject']['subject'] : '';
	const body = (message && message['mailObject']) ? message['mailObject']['body']?.substr(0, 75) : '';
	
	return (
		<Flex
			key={message.id}
			id={messageIndex}
			onClick={messageClickHandler}
			wrap='no-wrap'
			justify='space-around'
			py={2}
			bg='#E2E8F0'
			borderTop='1px'
			borderBottom='1px'
			borderColor='gray.300'
			cursor='pointer'
		>
			<Avatar name='FROM' src='https://bit.ly/tioluwani-kolawole' />
			<Box w='80%'>
				<Text fontSize='sm' color='gray.700' isTruncated>
					{name}
				</Text>
				<Text fontSize='md' fontWeight='bold' color='#3182ce' isTruncated>
					{subject}
				</Text>
				<Text fontSize='xs' color='gray.500'>
					{body}
				</Text>
			</Box>
		</Flex>
	);
}