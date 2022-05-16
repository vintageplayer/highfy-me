import {useContext} from 'react';
import {Flex, Box, Spinner} from '@chakra-ui/core';
import SearchBar from './SearchBar';
import EmailRow from "./EmailRow";
import UserContext from '../../context/user/UserContext';
import InfiniteScroll from "react-infinite-scroll-component";

const Messages = () => {
	const {messages, setMessage} = useContext(UserContext);
	
	const messageClickHandler = (e) => {
		const messageId = e.currentTarget.getAttribute('id');
		setMessage(messages[messageId]);
	}

	return (
		<Box overflow='auto' id='scrollableDiv'>
			<InfiniteScroll
				dataLength={messages.length}
				next={() => {}}
				hasMore={false}
				loader={<h4>Loading...</h4>}
				scrollableTarget='scrollableDiv'
			>
				{messages.map((message, index) => (
					<EmailRow
						key={index}
						message={message}
						messageIndex={index}
						messageClickHandler={messageClickHandler}
					/>
				))}
			</InfiniteScroll>
		</Box>
		)
}

const CustomSpinner = () => (
  <Box mt={6} display='flex' align='center' justifyContent='center'>
    <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
  </Box>
);

export default function EmailList () {
	const {messages, userLoading} = useContext(UserContext);

	return (
		<Flex
			direction='column'
			wrap='no-wrap'
			w='26%'
			h='100%'
			bg='#f1f1f1'
			color='black'
		>
		<SearchBar />
		{!messages.length && userLoading ? <CustomSpinner /> : <Messages />}
		</Flex>
	);
}