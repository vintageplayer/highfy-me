import { Fragment } from "react";
import { MdPeople } from "react-icons/md";
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
  useToast,
  useDisclosure,
  Select
} from "@chakra-ui/core";

const ChangeLabelModel = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fromAddress = form.elements["fromAddress"].value;
    const addressLabel = form.elements["addressLabel"].value;
    
    try {
      toast({
        title: "Processing Label Change.",
        description: "Submitting your address preference to blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      onClose();

      if(!props.isGasless){
        await props.updateAddressLabel(fromAddress, addressLabel, props.contract);
      } else {
        await props.updateAddressLabelGasless(fromAddress, addressLabel, props.web3Provider, toast);
      }
      
      toast({
        title: "Update Completed.",
        description: "Preference Caputured on Chain.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "An error occurred.",
        description: "Unable to update the label.",
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
        leftIcon={MdPeople}
        borderRadius='20px'
        variant='solid'
        variantColor='blue'
        onClick={onOpen}
      >
        Manage Addresses
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Address Category</ModalHeader>
          <ModalCloseButton />
          <form id='form' onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <Input
                  type='text'
                  id='fromAddress'
                  placeholder='Address'
                  aria-describedby='address-helper-text'
                />
              </FormControl>
              <FormControl isRequired>
                <Select id='addressLabel'>
                  <option value='INBOX'>Inbox</option>
                  <option value='SPAM'>Spam</option>
                  <option value='SUBSCRIPTION'>Subscription</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type='reset' variantColor='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type='submit' variantColor='green'>
                Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ChangeLabelModel;
