import {GroupUpObject} from '../../types/api';
import {
  Flex,
  VStack,
  HStack,
  Spacer,
  Box,
  Heading,
  Text,
  Image,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import React from 'react';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType} from '../../state';
import {changePlannedDate} from './api';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

type ChangeDate = {
  plannedDate: string;
};

const GroupUpDetail: React.FC<{groupUp: GroupUpObject}> = ({groupUp}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const setAlertState = useSetRecoilState(alertState);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<ChangeDate>();

  const onChangeDate = async (values: ChangeDate) => {
    onClose();
    const {success, plannedDate} = await changePlannedDate(
      groupUp.id,
      values.plannedDate
    ).catch(e => {
      console.error(e);
      return {success: false, plannedDate: undefined};
    });

    if (success && plannedDate) {
      setAlertState({
        type: AlertType.NOTIFY,
        message: 'Succesfully updated planned date',
        active: true,
      });
      groupUp.plannedDate = plannedDate;
    } else {
      setAlertState({
        type: AlertType.ERROR,
        message: 'An error occured while updating the date.',
        active: true,
      });
    }
  };

  const displayGroup = (groupId: number) => {
    navigate(
      `/groups/${groupId}?redirect=/groupups/${groupUp.id}&redirectNState=false`
    );
  };

  return (
    <Flex
      direction="column"
      height="fit-content"
      bg="groupWhite.200"
      minH="100%"
      maxWidth="100%"
      py={20}
    >
      <Flex justify="space-evenly" align="center">
        <Flex maxW="45%">
          <Image
            onClick={() => displayGroup(groupUp.group1.id)}
            borderRadius="full"
            boxShadow="xl"
            w="150px"
            src={process.env.PUBLIC_URL + '/images/groupImage.png'}
          />
          {/* TODO: SPRINT 3: Personal profile picture */}
        </Flex>
        <Flex justify="center" maxW={'10px'} overflow="visible" zIndex={2}>
          <Image
            w="50px"
            maxW="none"
            src={
              process.env.PUBLIC_URL +
              (groupUp.isSuperGroupup
                ? '/images/groupupGold.svg'
                : '/navicons/groupup.svg')
            }
          />
        </Flex>
        <Flex maxW="45%">
          <Image
            onClick={() => displayGroup(groupUp.group2.id)}
            borderRadius="full"
            boxShadow="xl"
            w="150px"
            src={process.env.PUBLIC_URL + '/images/GroupImage2.svg'}
          />
        </Flex>
      </Flex>
      <Flex justify="space-evenly" align="center">
        <Heading size="lg" w="45%" color="black" textAlign="center">
          {groupUp.group1.name}
        </Heading>
        <Heading size="lg" w="10px" color="black" textAlign={'center'}>
          |
        </Heading>
        <Heading w="45%" size="lg" color="black" textAlign={'center'}>
          {groupUp.group2.name}
        </Heading>
      </Flex>
      <Flex justify="center" align="center">
        <Heading w={'45%'} size="sm" color="black" textAlign={'right'}>
          {groupUp.group1.location}
        </Heading>
        <Box>
          <Image
            w="24px"
            src={process.env.PUBLIC_URL + '/images/LocationIcon.svg'}
          />
        </Box>
        <Heading w="45%" size="sm" color="black" textAlign={'left'}>
          {groupUp.group2.location}
        </Heading>
      </Flex>

      {/* You have matched text */}
      <VStack flex={2} p="0 10%">
        <Box pt="30px">
          <Text fontSize="20px" color="black" textAlign={'center'}>
            You have matched!
          </Text>
        </Box>
        <Box pt="10px">
          <Text fontSize="20px" color="black" textAlign={'center'}>
            {groupUp.plannedDate
              ? `The current planned date for meeting is ${groupUp.plannedDate}`
              : 'There is not set any planned date for meeting'}
          </Text>
          <Box textAlign={'center'}>
            <Button
              bg="groupGreen"
              onClick={onOpen}
              textColor="groupWhite.200"
              mt="5"
            >
              Change Date
            </Button>
          </Box>
        </Box>
        <Box pt="30px">
          <Text fontSize="20px" color="black" textAlign={'center'}>
            Use the contact info provided below to decide a meeting date.
          </Text>
        </Box>
      </VStack>
      <HStack>
        <Spacer />
        <Text fontSize="20px" color="black" textAlign={'left'}>
          {groupUp.group1.contactInfo}
        </Text>
        <Spacer />
        <Text fontSize="20px" color="black" textAlign={'right'}>
          {groupUp.group2.contactInfo}
        </Text>
        <Spacer />
      </HStack>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change date
            </AlertDialogHeader>
            <AlertDialogBody>
              <form onSubmit={handleSubmit(onChangeDate)}>
                <Box>
                  <FormControl isInvalid={!!errors.plannedDate} isRequired>
                    <FormLabel>New planned date</FormLabel>
                    <Input
                      data-testid="plannedDate"
                      type="date"
                      id="plannedDate"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('plannedDate', {
                        required: 'This is required',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.plannedDate && (
                        <span data-testid="date-error" role="alert">
                          {errors.plannedDate.message ||
                            (errors.plannedDate.type === 'validate' &&
                              'The date must be in the future')}
                        </span>
                      )}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box p="12">
                  <Button
                    mt={4}
                    bg="groupGreen"
                    textColor="groupWhite.200"
                    isLoading={isSubmitting}
                    type="submit"
                    data-testid="changeButton"
                  >
                    Change Date
                  </Button>
                </Box>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Box p="8">
                <Button
                  ref={cancelRef}
                  mt={4}
                  bg="groupGreen"
                  textColor="groupWhite.200"
                  onClick={onClose}
                  data-testid="cancelButton"
                >
                  Cancel
                </Button>
              </Box>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default GroupUpDetail;
