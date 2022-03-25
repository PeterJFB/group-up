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
import GroupUpGoldPromoteModal from '../GroupUpGoldPromoteModal';
import {useRecoilValue} from 'recoil';
import {confettiState, goldState} from '../../state';
import {useNavigate} from 'react-router-dom';

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
  const promote = useDisclosure();
  const [groupUpId, setGroupUpId] = useState<number | undefined>();
  const navigate = useNavigate();

  const [birthdays, setBirthdays] = useState<string[]>();
  const confetti = useRecoilValue(confettiState);
  const [isSGU, setIsSuperGroupUp] = useState(false);
  const gs = useRecoilValue(goldState);

  const fetchGroupUpRequest: React.MouseEventHandler<HTMLButtonElement> = e => {
    const outGoingSuperGroupUp = (e.target as HTMLButtonElement).id === 'super';

    if (outGoingSuperGroupUp && !gs.active) {
      return promote.onOpen();
    }

    // Check of user is eligble to superGroupUp

    fetchWithToken<GroupUpObject>('/api/groupups/', 'POST', {
      group1: chosenGroup.id,
      group2: group.id,
      isSuperGroupup: outGoingSuperGroupUp,
    }).then(response => {
      if (response.missingToken) {
        return;
      }
      if (response.body?.groupUpAccept) {
        setIsSuperGroupUp(response.body?.isSuperGroupup ?? false);
        setGroupUpId(response.body?.id);
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
        console.error(e);
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
            <GroupProfileDetail
              hideAdminControls
              group={group}
              birthdays={birthdays}
            />
          </ModalBody>

          <ModalFooter flexDir={'column'} gap="20px">
            <Button
              id="super"
              w={'200px'}
              shadow={'xl'}
              color="groupGreen"
              bgColor="groupGold"
              onClick={fetchGroupUpRequest}
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
              SuperGroupUp
            </Button>
            <Button
              w={'200px'}
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
      <Modal
        isOpen={announce.isOpen}
        onClose={() => {
          announce.onClose();
          refresh();
        }}
      >
        {confetti.active && (
          <Confetti colors={isSGU ? ['#FFC107'] : undefined} />
        )}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Congratulations!</ModalHeader>
          <ModalBody textAlign={'center'}>
            {chosenGroup.name} and {group.name} has now {isSGU && 'Super'}
            Grouped Up!
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
            <Button
              bgColor={isSGU ? 'groupGold' : 'groupGreen'}
              color={isSGU ? 'black' : 'groupWhite.200'}
              shadow={isSGU ? 'xl' : 'none'}
              colorScheme="blue"
              onClick={() => {
                if (groupUpId) {
                  navigate(`/groupups/${groupUpId}`);
                }
              }}
            >
              Go to GroupUp page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <GroupUpGoldPromoteModal
        isOpen={promote.isOpen}
        onClose={promote.onClose}
      >
        Use SuperGroupUp to be first priority to whoever you want to GroupUp
        with!
      </GroupUpGoldPromoteModal>
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
