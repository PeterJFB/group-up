import {
  Flex,
  VStack,
  HStack,
  Spacer,
  Box,
  Heading,
  Text,
  Image,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import {GroupObject} from '../../types/api';
import {generateAgeGapText, addMemberToGroup, deleteGroup} from './api';
import InterestItem from './InterestItem';
import MembersNumber from './MembersNumber';
import {GroupAdminOnlyButton} from './GroupAdminOnlyButton';
import AddUser, {AddUserObject} from './AddUser';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType, rbState} from '../../state';
import {useNavigate} from 'react-router-dom';

const GroupProfileDetail: React.FC<{
  group: GroupObject;
  birthdays?: string[];
  hideAdminControls?: boolean;
}> = ({group, birthdays, hideAdminControls = false}) => {
  const ageGapText = birthdays ? generateAgeGapText(birthdays) : '...';

  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();
  const {
    isOpen: delIsOpen,
    onOpen: delOnOpen,
    onClose: delOnClose,
  } = useDisclosure();

  const setAlertState = useSetRecoilState(alertState);
  const navigate = useNavigate();
  const setRBState = useSetRecoilState(rbState);

  const onSubmit = async (values: AddUserObject) => {
    addOnClose();
    const {success} = await addMemberToGroup({
      groupId: group.id,
      email: values.email,
    });
    if (success) {
      setAlertState({
        type: AlertType.NOTIFY,
        message: 'Succesfully added member to group',
        active: true,
      });
    } else {
      setAlertState({
        type: AlertType.ERROR,
        message:
          'An error occured. This could be a server error, or the person does not exist.',
        active: true,
      });
    }
  };

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const onDeleteClick = async () => {
    try {
      delOnClose();
      const {success} = await deleteGroup(group.id);
      if (success) {
        setAlertState({
          type: AlertType.NOTIFY,
          message: `Group ${group.name} was successfully deleted.`,
          active: true,
        });
        setRBState([
          false,
          () => {
            return;
          },
        ]);
        navigate('/groups');
      } else {
        setAlertState({
          type: AlertType.ERROR,
          message: `Group ${group.name} could not be deleted.`,
          active: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex
      flexDir="column"
      flex={1}
      height="100%"
      width="100%"
      bg="groupWhite.200"
      py={10}
    >
      <VStack w="full">
        <HStack w="full">
          <Spacer />
          <VStack spacing="10px">
            <Box>
              <Image
                borderRadius="full"
                boxShadow="xl"
                w="150px"
                src={process.env.PUBLIC_URL + '/images/groupImage2.png'}
              />
              {/* TODO: SPRINT 2: Personal profile picture */}
            </Box>
            <Heading w={'300px'} size="lg" color="black" textAlign={'center'}>
              {group.name}
            </Heading>
          </VStack>
          <Spacer />
        </HStack>

        {/* MEMBER COUNT, AGE RANGE AND LOCATION */}
        <Flex w="full" mb="15px">
          <Spacer />
          <MembersNumber members={group.members} />
          <Spacer />
          <Box>
            <Text fontSize={'20px'} textAlign={'center'}>
              {ageGapText}
            </Text>
            {/*TODO: Replace text object above with multi-line text object containing ages, time and rating. */}
          </Box>
          <Spacer />
          <Box flex={1} color="black">
            <HStack>
              <Image
                w="24px"
                src={process.env.PUBLIC_URL + '/images/LocationIcon.svg'}
              />
              <Text fontSize="20px">{group.location}</Text>
            </HStack>
          </Box>
          <Spacer />
        </Flex>
        <Flex pt="5" wrap={'wrap'} gap="4px">
          {group.interests.map(interest => {
            return <InterestItem key={interest.name} interest={interest} />;
            //TODO: Add max length to interest fields to avoid overflow
            //TODO: In case of overflow, show as many as will fit, then [+N] as the last field to show they have N more interests
          })}
        </Flex>

        {/* QUOTE AND DESCRIPTION */}
        <VStack flex={2} p="0 10%">
          <Box pt="30px">
            <Text
              fontStyle={'italic'}
              fontSize="20px"
              color="black"
              textAlign={'center'}
            >
              {group.quote}
            </Text>
          </Box>
          <Box pt="30px">
            <Text fontSize="20px" color="black" textAlign={'center'}>
              {group.description}
            </Text>
          </Box>
          {!hideAdminControls && (
            <>
              <Box pt="85">
                <GroupAdminOnlyButton
                  bg="groupGreen"
                  groupAdmin={group.groupAdmin}
                  buttonText="Add member"
                  onClick={addOnOpen}
                ></GroupAdminOnlyButton>
                <Modal isOpen={addIsOpen} onClose={addOnClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <AddUser onSubmit={onSubmit} />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Box>

              {/* TODO: Check if groupadmin and hide if not. */}
              <Box pt="0">
                <GroupAdminOnlyButton
                  bg="groupRed"
                  groupAdmin={group.groupAdmin}
                  buttonText={'Delete group'}
                  onClick={delOnOpen}
                />
                <AlertDialog
                  isOpen={delIsOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={delOnClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete group
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        <Box>
                          <Text fontSize="sm">
                            Do you want to delete this group?
                          </Text>
                        </Box>
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Box p="8">
                          <Button
                            ref={cancelRef}
                            mt={4}
                            bg="groupGreen"
                            textColor="groupWhite.200"
                            onClick={delOnClose}
                            data-testid="cancelButton"
                          >
                            Cancel
                          </Button>
                        </Box>
                        <Box p="12">
                          <Button
                            mt={4}
                            bg="groupRed"
                            textColor="groupWhite.200"
                            onClick={onDeleteClick}
                            data-testid="deleteButton"
                          >
                            Delete
                          </Button>
                        </Box>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Box>
            </>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
};

export default GroupProfileDetail;
