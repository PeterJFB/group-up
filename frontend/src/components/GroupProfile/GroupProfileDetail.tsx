import {
  Flex,
  VStack,
  HStack,
  Spacer,
  Box,
  Heading,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import {GroupObject} from '../../types/api';
import {generateAgeGapText, addMemberToGroup} from './api';
import InterestItem from './InterestItem';
import MembersNumber from './MembersNumber';
import {GroupAdminOnlyButton} from './GroupAdminOnlyButton';
import AddUser, {AddUserObject} from './AddUser';

const GroupProfileDetail: React.FC<{
  group: GroupObject;
  birthdays?: string[];
}> = ({group, birthdays}) => {
  const ageGapText = birthdays ? generateAgeGapText(birthdays) : '...';

  const {isOpen, onOpen, onClose} = useDisclosure();

  const onSubmit = async (values: AddUserObject) => {
    onClose();
    const {success, members} = await addMemberToGroup({
      groupId: group.id,
      email: values.email,
    });
    if (success) console.log(members);
  };

  return (
    <Flex flexDir="column" height="100%" width="100%">
      <Flex flex={8} py={20} bg="groupWhite.200">
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

            <Box pt="100px">
              <GroupAdminOnlyButton
                groupAdmin={group.groupAdmin}
                buttonText="Add member"
                onClick={onOpen}
              ></GroupAdminOnlyButton>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Register Group</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <AddUser onSubmit={onSubmit} />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default GroupProfileDetail;
