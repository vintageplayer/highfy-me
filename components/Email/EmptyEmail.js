import {Flex, Heading} from '@chakra-ui/core';
import emptyEmailImg from "./empty_email.svg";

export default function EmptyMail() {
	return (
		<Flex
			flexDirection='column'
			justify='center'
			alignItems='center'
			mb={3}
			style={{height: "100%"}}
		>
			<img
				src={emptyEmailImg.src}
				alt='React Logo'
				style={{ width: "40%", height: "auto" }}
			/>
			<Heading as='h3' size='lg' color='#a6b0b7' mt={5}>
				Click on Email to Open it
			</Heading>
		</Flex>
		)
}