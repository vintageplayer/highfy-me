import { MdReplay } from "react-icons/md";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Input,
	FormControl,
	Textarea,
	useDisclosure
} from '@chakra-ui/core';

export default function ReplyModel() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button
				rightIcon={MdReplay}
				variantColor='blue'
				variant='outline'
				onClick={onOpen}
			>
				Reply
			</Button>
			<Modal
				isOpen={isOpen}
				size='xl'
				onClose={onClose}
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Reply </ModalHeader>
					<ModalCloseButton />
					<form>
						<ModalBody>
							<Input
								type='hidden'
								id='reply-message-id'
								value='ipfs_hash_19192'
								readOnly
							/>
							<FormControl isRequired>
								<Input
									type='text'
									id='emailTo'
									placeholder='To'
									aria-describedby='email-helper-text'
									value='0x137...d'
									readOnly
								/>
							</FormControl>
							<FormControl isRequired>
								<Input
									type='text'
									id='subject'
									placeholder='Subject'
									aria-describedby='subject-email-helper-text'
									value='Subject: First Email for Addresses'
									readOnly
								/>
							</FormControl>
							<FormControl isRequired>
								<Textarea
									id='message'
									minH='280px'
									size='xl'
									resize='vertidcal'
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
	)
}