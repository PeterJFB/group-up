import {useForm} from 'react-hook-form';
import {Box, Flex, Container} from '@chakra-ui/react';
import React from 'react';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';
import {CreateGroupObject} from './types';
type CreateGroupFormProps = {
  onSubmit: (values: CreateGroupObject) => void;
};

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSubmit,
}: CreateGroupFormProps) => {
  /**
   * Register user form with fields First name, last name, username, email, password, and confirm password
   * Should send a register post request to the backend, and if succesful should login user and redirect to
   * home sreen
   */
  const {
    handleSubmit,
    register,
    getValues,
    formState: {errors, isSubmitting},
  } = useForm<CreateGroupObject>();

  const dateIsLaterThanToday = (): boolean => {
    const date = getValues('date');
    const delta = new Date(date).getTime() - new Date().getTime();
    return delta > 0;
  };

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex px={10} py={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box py={2}>
            <FormControl isInvalid={!!errors.groupname} isRequired>
              <FormLabel>Group Name</FormLabel>
              <Input
                id="groupname"
                placeholder="Rocinante"
                {...register('groupname', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå\\-]*$/i,
                    message: 'Invalid name',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.groupname && (
                  <span data-testid="groupname-error" role="alert">
                    {errors.groupname.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.groupdesc} isRequired>
              <FormLabel>Group description</FormLabel>
              <Input
                id="groupdesc"
                placeholder="Saving the universe, one day at a time."
                {...register('groupdesc', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå \\-]*$/i,
                    message: 'Invalid description',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.groupdesc && (
                  <span data-testid="groupdesc-error" role="alert">
                    {errors.groupdesc.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.location} isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                id="location"
                placeholder="The moon"
                {...register('location', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå \\-]*$/i,
                    message: 'Invalid location',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.location && (
                  <span data-testid="location-error" role="alert">
                    {errors.location.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.interests} isRequired>
              <FormLabel>interests</FormLabel>
              <Input
                id="interests"
                placeholder="cars, bikes, climbing"
                {...register('interests', {
                  required: 'This is required',
                  pattern: {
                    value: /^([A-Za-zÆæØøÅå ]{3,}[,]{0,1}){2,}$/i,
                    message:
                      'Interests should be given in comma separated list',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.interests && (
                  <span data-testid="interests-error" role="alert">
                    {errors.interests.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.date} isRequired>
              <FormLabel>Date for meet</FormLabel>
              <Input
                type="date"
                id="date"
                {...register('date', {
                  required: 'This is required',
                  validate: dateIsLaterThanToday,
                })}
              />
              <FormErrorMessage>
                {errors.date && (
                  <span data-testid="date-error" role="alert">
                    {errors.date.message ||
                      (errors.date.type === 'validate' &&
                        'The date must be in the future')}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.quote} isRequired>
              <FormLabel>Meeting Quote</FormLabel>
              <Input
                id="quote"
                placeholder="We want to go fishing"
                {...register('quote', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå \\-]*$/i,
                    message: 'Invalid description',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.quote && (
                  <span data-testid="quote-error" role="alert">
                    {errors.quote.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Flex>
    </Container>
  );
};

export default CreateGroupForm;
