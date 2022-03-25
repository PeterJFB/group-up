import React, {useEffect} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  useDisclosure,
  ModalHeader,
} from '@chakra-ui/react';
import {useRecoilState} from 'recoil';
import {alertState} from '../../state';

//Can be invoked by setting the Modalstate.active to true
const AlertModal: React.FC = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [aState, setAState] = useRecoilState(alertState);
  const {type, message, active} = aState;

  useEffect(() => {
    if (active) {
      onOpen();
    }
  }, [active]);

  const closeModal = () => {
    setAState({...aState, active: false});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text align={'center'}>
            {type == 'NOTIFY' ? 'Notification!' : 'An error occured!'}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text align={'center'}>{message}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={type == 'NOTIFY' ? 'blue' : 'red'}
            mr={3}
            onClick={closeModal}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
