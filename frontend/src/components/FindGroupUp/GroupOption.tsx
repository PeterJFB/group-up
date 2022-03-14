import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
  Heading,
  HStack,
  Image,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {GroupObject} from '../../api/types';
import {GroupListItem} from '../GroupListItem';
import {fetchGroupAges} from '../GroupProfile/api';
import GroupProfileDetail from '../GroupProfile/GroupProfileDetail';

type GroupOptionProps = {
  group: GroupObject;
  setChosenGroup?: React.Dispatch<
    React.SetStateAction<GroupObject | undefined>
  >;
};

export const GroupOption: React.FC<GroupOptionProps> = ({
  group,
  setChosenGroup,
}) => {
  return (
    <GroupListItem
      group={group}
      onClick={() => {
        setChosenGroup && setChosenGroup(group);
      }}
    />
  );
};

export const GroupUpOption: React.FC<GroupOptionProps> = ({group}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [birthdays, setBirthdays] = useState<string[]>();

  useEffect(() => {
    fetchGroupAges(group.id)
      .then(birthdays => {
        if (birthdays) setBirthdays(birthdays);
      })
      .catch(e => {
        console.log(e);
      });
    return () => {
      onClose();
    };
  }, [group]);
  return (
    <>
      <GroupListItem group={group} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="groupWhite.200">
          <ModalBody p={0}>
            <GroupProfileDetail group={group} birthdays={birthdays} />
          </ModalBody>

          <ModalFooter>
            <Button
              bgColor="groupGreen"
              color="groupWhite.200"
              onClick={onClose}
              variant="ghost"
              mr={3}
              outline="none"
              _focus={{outline: 'none'}}
            >
              GroupUp
            </Button>
            <ModalCloseButton />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const ChosenGroup: React.FC<GroupOptionProps> = ({group}) => {
  return (
    <HStack justify={'center'} bgColor="white" h="50px">
      <Image
        maxHeight="90%"
        minHeight="90%"
        src={`${process.env.PUBLIC_URL}/images/groupImage.png`}
      />
      <Heading size={'md'}>{group.name}</Heading>
    </HStack>
  );
};
