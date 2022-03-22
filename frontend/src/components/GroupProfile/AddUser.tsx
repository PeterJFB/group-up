import {
  Flex,
  Container,
  FormControl,
  Input,
  FormLabel,
  Box,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react';
import React from 'react';
import {useForm} from 'react-hook-form';

type AddUserProps = {
  onSubmit: (values: AddUserObject) => void;
};

export type AddUserObject = {
  email: string;
};

export const AddUser: React.FC<AddUserProps> = ({onSubmit}: AddUserProps) => {
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<AddUserObject>();
  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex px={10} py={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">User email</FormLabel>
            <Input
              data-testid="email"
              id="email"
              placeholder="bob@example.org"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email pattern',
                },
              })}
            ></Input>
            <FormErrorMessage>
              {errors.email && (
                <span data-testid="email-error" role="alert">
                  {errors.email.message}
                </span>
              )}
            </FormErrorMessage>
          </FormControl>
          <Box>
            {/* TODO: Keep modal open after submit, to allow for adding multiple 
                new members to group. */}
            <Button
              mt={4}
              bg="groupGreen"
              textColor="groupWhite.200"
              isLoading={isSubmitting}
              type="submit"
            >
              Add new member
            </Button>
          </Box>
        </form>
      </Flex>
    </Container>
  );
};

export default AddUser;
