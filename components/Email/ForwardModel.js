import {
	Button,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	Input,
	Textarea
} from '@chakra-ui/core';
import { MdArrowForward } from "react-icons/md";

export default function ForwardModel() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button
				rightIcon={MdArrowForward}
				variantColor='blue'
				variant='outline'
				onClick={onOpen}
			>
				Forward
			</Button>
			<Modal
				isOpen={isOpen}
				size='xl'
				onClose={onClose}
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Forward</ModalHeader>
					<ModalCloseButton />
					<form>
						<ModalBody>
							<FormControl isRequired>
								<Input
									type='text'
									id='emailTo'
									placeholder='To'
									aria-describedby='email-helper-text'
								/>
							</FormControl>
							<FormControl isRequired>
								<Input
									type='text'
									id='subject'
									placeholder='Subject'
									aria-describedby='subject-email-helper-text'
									value='Forward: {Old Subject}'
									readOnly
								/>
							</FormControl>
							<FormControl isRequired>
								<Textarea
									id='message'
									minH='280px'
									size='xl'
									resize='vertical'
									value="------Forward Message------\r\n"
									readOnly
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button type='reset' variantColor='blue' mr={3} onClick={onClose}>
								Close
							</Button>
							<Button type='submit' variantColor='green'>
								Send
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}