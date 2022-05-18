import { Fragment } from "react";
// import { Base64 } from "js-base64";
import { BsPlusCircle } from "react-icons/bs";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  Textarea,
  useToast,
  useDisclosure,
} from "@chakra-ui/core";
import {useContext} from 'react';

const SendModel = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const receiver = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const mailBody = form.elements["message"].value;

    const mailObject = {
      to: receiver,
      from: props.loggedInUser,
      subject: subject,
      body: mailBody
    }
    
    try {
      toast({
        title: "Processing Mail.",
        description: "Processing your email for decentralised communication.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      await props.sendMail(mailObject, props.web3Provider);
      toast({
        title: "Message Sent.",
        description: "Email sent through decentralised communication.",
        status: "success",
        duration: 15000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your email.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }        
  };

  return (
    <Fragment>
      <Button
        w='100%'
        h='48px'
        leftIcon={BsPlusCircle}
        borderRadius='20px'
        variant='solid'
        variantColor='blue'
        onClick={onOpen}
      >
        New Message
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Message</ModalHeader>
          <ModalCloseButton />
          <form id='form' onSubmit={handleSubmit}>
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
                />
              </FormControl>
              <FormControl isRequired>
                <Textarea
                  id='message'
                  minH='280px'
                  size='xl'
                  resize='vertical'
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
    </Fragment>
  );
};

export default SendModel;
