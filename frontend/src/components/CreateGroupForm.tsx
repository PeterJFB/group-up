import {useForm} from 'react-hook-form';
import {Box, Flex, Container} from '@chakra-ui/react';
import React from 'react';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
} from '@chakra-ui/react';
import {CreateGroupObject} from './types';
import {GroupObject} from '../types/api';
type CreateGroupFormProps = {
  onSubmit: (values: CreateGroupObject) => void;
  initialValues?: GroupObject;
};

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSubmit,
  initialValues = undefined,
}: CreateGroupFormProps) => {
  /**
   * Register user form with fields First name, last name, username, email, password, and confirm password
   * Should send a register post request to the backend, and if successful should login user and redirect to
   * home screenSubmit
   */
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<CreateGroupObject>();

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex px={10} py={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box py={2}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel>Group Name</FormLabel>
              <Input
                defaultValue={initialValues?.name ?? ''}
                id="name"
                placeholder="Weekend Fishing Group"
                {...register('name', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå \\-]*$/i,
                    message: 'Invalid name',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.name && (
                  <span data-testid="name-error" role="alert">
                    {errors.name.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.quote} isRequired>
              <FormLabel>One-Liner</FormLabel>
              <Input
                defaultValue={initialValues?.quote ?? ''}
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
          <Box py={2}>
            <FormControl isInvalid={!!errors.description} isRequired>
              <FormLabel>Group description</FormLabel>
              <Textarea
                defaultValue={initialValues?.description ?? ''}
                id="description"
                placeholder="We like to fish, there's nothing like the smell of fresh bait and gasoline on the lake."
                {...register('description', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Za-zÆæØøÅå \\\-.?!,']*$/i,
                    message: 'Invalid description',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.description && (
                  <span data-testid="description-error" role="alert">
                    {errors.description.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box py={2}>
            <FormControl isInvalid={!!errors.location} isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                defaultValue={initialValues?.location ?? ''}
                id="location"
                placeholder="Nidelva"
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
                defaultValue={
                  initialValues?.interests.map(interest => interest.name) ?? ''
                }
                id="interests"
                placeholder="Fishing, Boating, Chilling"
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
            <FormControl isInvalid={!!errors.meetingDate} isRequired>
              <FormLabel>Date for meet</FormLabel>
              <Input
                defaultValue={initialValues?.meetingDate.toString() ?? ''}
                type="date"
                id="meetingDate"
                min={new Date().toISOString().split('T')[0]}
                {...register('meetingDate', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.meetingDate && (
                  <span data-testid="date-error" role="alert">
                    {errors.meetingDate.message ||
                      (errors.meetingDate.type === 'validate' &&
                        'The date must be in the future')}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box>
          {/* <Box py={2}>
            <FormControl isInvalid={!!errors.contactInfo} isRequired>
              <FormLabel htmlFor="contactInfo">Contact email</FormLabel>
              <Input
                id="contactInfo"
                placeholder="example@gmail.com"
                {...register('contactInfo', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.contactInfo && (
                  <span data-testid="contactInfo-error" role="alert">
                    {errors.contactInfo.message}
                  </span>
                )}
              </FormErrorMessage>
            </FormControl>
          </Box> */}
          <Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              bg="groupGreen"
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
