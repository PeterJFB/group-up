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
  ModalHeader,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {fetchWithToken} from '../../api/api';
import {GroupObject, GroupUpObject} from '../../types/api';
import {GroupListItem} from '../GroupListItem';
import {fetchGroupAges} from '../GroupProfile/api';
import GroupProfileDetail from '../GroupProfile/GroupProfileDetail';
import Confetti from 'react-confetti';

type GroupOptionProps = {
  group: GroupObject;
  setChosenGroup?: React.Dispatch<
    React.SetStateAction<GroupObject | undefined>
  >;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GroupOption: React.FC<GroupOptionProps> = ({
  group,
  setChosenGroup,
  setIsLoading,
}) => {
  return (
    <GroupListItem
      group={group}
      onClick={() => {
        setChosenGroup && setChosenGroup(group);
        setIsLoading && setIsLoading(true);
      }}
    />
  );
};

type GroupUpOptionProps = {
  group: GroupObject;
  chosenGroup: GroupObject;
  refresh: () => void;
};

export const GroupUpOption: React.FC<GroupUpOptionProps> = ({
  group,
  chosenGroup,
  refresh,
}) => {
  const detail = useDisclosure();
  const announce = useDisclosure();

  const [birthdays, setBirthdays] = useState<string[]>();

  const fetchGroupUpRequest = () => {
    fetchWithToken<GroupUpObject>('/api/groupups/', 'POST', {
      group1: chosenGroup.id,
      group2: group.id,
    }).then(e => {
      if (e.missingToken) {
        return;
      }
      if (e.body?.groupUpAccept) {
        detail.onClose();
        announce.onOpen();
      } else {
        detail.onClose();
        refresh();
      }
    });
  };

  useEffect(() => {
    fetchGroupAges(group.id)
      .then(birthdays => {
        if (birthdays) setBirthdays(birthdays);
      })
      .catch(e => {
        console.log(e);
      });
    return () => {
      detail.onClose();
    };
  }, [group]);
  return (
    <>
      <GroupListItem group={group} onClick={detail.onOpen} />

      {/* Detail about a potential group */}
      <Modal isOpen={detail.isOpen} onClose={detail.onClose}>
        <ModalOverlay />
        <ModalContent bgColor="groupWhite.200">
          <ModalBody p={0}>
            <GroupProfileDetail group={group} birthdays={birthdays} />
          </ModalBody>

          <ModalFooter>
            <Button
              bgColor="groupGreen"
              color="groupWhite.200"
              onClick={fetchGroupUpRequest}
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

      {/* Announce a successful GroupUp */}
      <Modal isOpen={announce.isOpen} onClose={announce.onClose}>
        <Confetti />
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Congratulations!</ModalHeader>
          <ModalBody textAlign={'center'}>
            {chosenGroup.name} and {group.name} has now Grouped Up!
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                announce.onClose();
                refresh();
              }}
            >
              Close
            </Button>
            <Button colorScheme="blue" bgColor="groupGreen">
              Go to GroupUp page
            </Button>
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