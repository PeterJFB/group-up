import {GroupObject, GroupUpObject} from '../../types/api';
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

type props = {
  groupUp: GroupUpObject;
  group1: GroupObject;
  group2: GroupObject;
};

type ChangeDate = {
  plannedDate: string;
};

const GroupUpDetail: React.FC<props> = ({groupUp, group1, group2}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const setAlertState = useSetRecoilState(alertState);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const {
    handleSubmit,
    register,
    getValues,
    formState: {errors, isSubmitting},
  } = useForm<ChangeDate>();

  const dateIsLaterThanToday = (): boolean => {
    const plannedDate = getValues('plannedDate');
    const delta = new Date(plannedDate).getTime() - new Date().getTime();
    return delta > 0;
  };
  console.log(group1, group2, groupUp);

  const onChangeDate = async (values: ChangeDate) => {
    onClose();
    const {success, plannedDate} = await changePlannedDate(
      groupUp.id,
      values.plannedDate
    );
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
        message: 'An error occured.',
        active: true,
      });
    }
  };

  return (
    <Flex flexDir="column" height="100%" width="100%">
      <Flex flex={8} py={20} bg="groupWhite.200">
        <VStack w="full">
          <HStack w="full">
            <Spacer />
            <Box>
              <Image
                borderRadius="full"
                boxShadow="xl"
                w="150px"
                src={process.env.PUBLIC_URL + '/images/groupImage2.png'}
              />
              {/* TODO: SPRINT 3: Personal profile picture */}
            </Box>
            <Box>
              <Image
                borderRadius="full"
                boxShadow="xl"
                w="50px"
                src={process.env.PUBLIC_URL + '/navicons/groupup.svg'}
              />
            </Box>
            <Box>
              <Image
                borderRadius="full"
                boxShadow="xl"
                w="150px"
                src={process.env.PUBLIC_URL + '/images/groupImage2.png'}
              />
            </Box>
            <Spacer />
          </HStack>
          <HStack>
            <Spacer />
            <Heading w={'150px'} size="lg" color="black" textAlign={'center'}>
              {group1.name}
            </Heading>
            <Heading w={'50px'} size="lg" color="black" textAlign={'center'}>
              |
            </Heading>
            <Heading w={'150px'} size="lg" color="black" textAlign={'center'}>
              {group2.name}
            </Heading>
            <Spacer />
          </HStack>
          <HStack>
            <Spacer />
            <Heading w={'300px'} size="sm" color="black" textAlign={'right'}>
              {group1.location}
            </Heading>
            <Box>
              <Image
                w="24px"
                src={process.env.PUBLIC_URL + '/images/LocationIcon.svg'}
              />
            </Box>
            <Heading w={'300px'} size="sm" color="black" textAlign={'left'}>
              {group2.location}
            </Heading>
            <Spacer />
          </HStack>

          {/* You have matched text */}
          <VStack flex={2} p="0 10%">
            <Box pt="30px">
              <Text fontSize="20px" color="black" textAlign={'center'}>
                You have matched!
              </Text>
            </Box>
            <Box pt="10px">
              <Text fontSize="20px" color="black" textAlign={'center'}>
                {(() => {
                  if (groupUp.plannedDate) {
                    return `The current planned date for meeting is ${groupUp.plannedDate}`;
                  } else {
                    return 'There is not set any planned date for meeting';
                  }
                })()}
                {/* {// The current planned date for meeting is {groupUp.plannedDate}} */}
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
              {group1.contactInfo}
            </Text>
            <Spacer />
            <Text fontSize="20px" color="black" textAlign={'right'}>
              {group2.contactInfo}
            </Text>
            <Spacer />
          </HStack>
        </VStack>
      </Flex>
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
                      {...register('plannedDate', {
                        required: 'This is required',
                        validate: dateIsLaterThanToday,
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
