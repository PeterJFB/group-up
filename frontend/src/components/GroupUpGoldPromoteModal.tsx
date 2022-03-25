import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import {useNavigate} from 'react-router-dom';

const GroupUpGoldPromoteModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="groupWhite.200" p={3}>
        <ModalHeader>
          <Text align={'center'}>This feature is only for GroupUp Gold</Text>
        </ModalHeader>
        <ModalBody p={0} alignItems="center" textAlign={'center'}>
          {children}
          <Spacer h={'20px'} />
          Support us with GroupUp Gold to get SuperGroupUps and show
          appreciation to your future friends!
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            id="super"
            w={'230px'}
            shadow={'xl'}
            color="groupGreen"
            bgColor="groupGold"
            onClick={() => {
              navigate('/profile');
            }}
            variant="ghost"
            mr={3}
            outline="none"
            _focus={{outline: 'none'}}
            justifyContent="flex-start"
            alignItems={'center'}
          >
            <Image
              src={`${process.env.PUBLIC_URL}/navicons/groupup.svg`}
              maxH="40px"
              m={1}
            />
            Get GroupUp Gold
          </Button>
          <ModalCloseButton />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupUpGoldPromoteModal;
