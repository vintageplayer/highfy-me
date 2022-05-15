import {Flex, Box, Spinner} from '@chakra-ui/core';
import SearchBar from "./SearchBar";

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
		<CustomSpinner />
		</Flex>
	);
}