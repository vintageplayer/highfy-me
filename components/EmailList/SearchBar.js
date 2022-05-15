import {useState} from 'react';
import {Box, InputGroup, Input, IconButton} from '@chakra-ui/core';

export default function SearchBar() {
	const [query, setQuery] = useState("");

	const handleSearchQueryUpdate = (e) => setQuery(e.target.value);
	return (
		<Box py='5px' bg='white' border='1px' borderColor='gray.200'>
			<InputGroup size='lg'>
			<IconButton
				icon='search'
				variant='ghost'
				variantColor='blue'
				marginLeft='5px'
				aria-label='Search messages'
				isLoading={true}
			/>
			<Input
				type='text'
				placeholder='Search mail'
				borderWidth='0px'
				borderRadius='0px'
				focusBorderColor='white'
				value={query}
				onChange={handleSearchQueryUpdate}
			/>
			</InputGroup>
		</Box>
	);
}