import {useForm} from 'react-hook-form';
import React from 'react';

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
  Container,
} from '@chakra-ui/react';
import {RegisterUserObject} from './types';
import {registerAndSaveToken} from '../api/api';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType} from '../state';
type RegisterFormProps = {
  rerender: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  rerender,
}: RegisterFormProps) => {
  /**
   * Register user form with fields First name, last name, username, email, password, and confirm password
   * Should send a register post request to the backend, and if successful should login user and redirect to
   * home screen
   */
  const {
    handleSubmit,
    register,
    trigger,
    getValues,
    formState: {errors, isSubmitting},
  } = useForm<RegisterUserObject>();

  const isOldEnough = (): boolean => {
    const date = getValues('birthdate');
    return new Date().getFullYear() - new Date(date).getFullYear() >= 18;
  };
  const passwordMatches = (): boolean => {
    return getValues('password') == getValues('confirmPassword');
  };

  const setAlertState = useSetRecoilState(alertState);

  const onSubmit = async (values: RegisterUserObject) => {
    const status = await registerAndSaveToken(values).catch(() => {
      return -1;
    });
    if (status != 200)
      setAlertState({
        type: AlertType.ERROR,
        message:
          'Could not register because of unexpected server error. Please try again later.',
        active: true,
      });
    else rerender();
  };

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex px={10} py={2}>
        <Box py={'5'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.first_name}>
                <FormLabel htmlFor="first_name">First Name</FormLabel>
                <Input
                  id="first_name"
                  placeholder="John"
                  {...register('first_name', {
                    required: 'This is required',
                    pattern: {
                      value: /^[A-Za-zÆæØøÅå\\-]*$/i,
                      message: 'Invalid name',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.first_name && (
                    <span data-testid="first_name-error" role="alert">
                      {errors.first_name.message}
                    </span>
                  )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.last_name}>
                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                <Input
                  id="last_name"
                  placeholder="Green"
                  {...register('last_name', {
                    required: 'This is required',
                    pattern: {
                      value: /^[A-Za-zÆæØøÅå\\-]*$/i,
                      message: 'Invalid name',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.last_name && (
                    <span data-testid="last_name-error" role="alert">
                      {errors.last_name.message}
                    </span>
                  )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="johngreen@gmail.com"
                  {...register('email', {
                    required: 'This is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && (
                    <span data-testid="email-error" role="alert">
                      {errors.email.message}
                    </span>
                  )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="johnnyboy"
                  {...register('username', {
                    required: 'This is required',
                    minLength: {
                      value: 3,
                      message: 'Minimum length should be 3',
                    },
                    pattern: {
                      value: /^[A-Za-zÆæØøÅå0-9\\_\\-]*$/i,
                      message: 'Invalid username',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && (
                    <span data-testid="username-error" role="alert">
                      {errors.username.message}
                    </span>
                  )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.birthdate}>
                <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
                <Input
                  type="date"
                  id="birthdate"
                  {...register('birthdate', {
                    required: 'This is requires',
                    validate: isOldEnough,
                  })}
                />
                <FormErrorMessage>
                  {errors.birthdate &&
                    ((errors.birthdate &&
                      errors.birthdate.type === 'validate' && (
                        <span data-testid="birthdate-error-age" role="alert">
                          You must be older than 18
                        </span>
                      )) || (
                      <span data-testid="birthdate-error-required" role="alert">
                        {errors.birthdate.message}
                      </span>
                    ))}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  data-testid="password"
                  id="password"
                  placeholder="password"
                  {...register('password', {
                    required: 'This is required',
                    minLength: {
                      value: 5,
                      message: 'Minimum length should be 5',
                    },
                    onChange: () => {
                      trigger('confirmPassword');
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && (
                    <span data-testid="password-error" role="alert">
                      {errors.password.message}
                    </span>
                  )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'2'}>
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  data-testid="confirmPassword"
                  placeholder="password"
                  {...register('confirmPassword', {
                    validate: passwordMatches,
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === 'validate' && (
                      <span data-testid="confirmPassword-error" role="alert">
                        Passwords must match
                      </span>
                    )}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box py={'0'}>
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
        </Box>
      </Flex>
    </Container>
  );
};
export default RegisterForm;
