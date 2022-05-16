import {useState, useContext} from 'react';
import {Box, InputGroup, Input, IconButton} from '@chakra-ui/core';
import UserContext from '../../context/user/UserContext';

export default function SearchBar() {
	const {userLoading} = useContext
	const [query, setQuery] = useState("");

	const handleSearchQueryUpdate = (e) => setQuery(e.target.value);

	const handleSearchQuery = (e) => {
		if(!query) return;
		if (e.keyCode === 13 || e.type === "click") {
			console.log(`Searching for query: ${query}`);
			alert('Search is not working currently!');
		}
	}

	return (
		<Box py='5px' bg='white' border='1px' borderColor='gray.200'>
			<InputGroup size='lg'>
			<IconButton
				icon='search'
				variant='ghost'
				variantColor='blue'
				marginLeft='5px'
				aria-label='Search messages'
				onClick={handleSearchQuery}
				isLoading={userLoading}
			/>
			<Input
				type='text'
				placeholder='Search mail'
				borderWidth='0px'
				borderRadius='0px'
				focusBorderColor='white'
				value={query}
				onChange={handleSearchQueryUpdate}
				onKeyDown={handleSearchQuery}
			/>
			</InputGroup>
		</Box>
	);
}