import {useForm} from 'react-hook-form';
import React from 'react';

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';
import {RegisterUserObject} from './types';
type RegisterFormProps = {
  onSubmit: (values: RegisterUserObject) => Promise<number>;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.firstName}>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <Input
          id="firstName"
          placeholder="John"
          {...register('firstName', {
            required: 'This is required',
            pattern: {
              value: /^[A-Za-zÆæØøÅå\\-]*$/i,
              message: 'Invalid name',
            },
          })}
        />
        <FormErrorMessage>
          {errors.firstName && (
            <span data-testid="firstName-error" role="alert">
              {errors.firstName.message}
            </span>
          )}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.lastName}>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <Input
          id="lastName"
          placeholder="Green"
          {...register('lastName', {
            required: 'This is required',
            pattern: {
              value: /^[A-Za-zÆæØøÅå\\-]*$/i,
              message: 'Invalid name',
            },
          })}
        />
        <FormErrorMessage>
          {errors.lastName && (
            <span data-testid="lastName-error" role="alert">
              {errors.lastName.message}
            </span>
          )}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          placeholder="email"
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

      <FormControl isInvalid={!!errors.username}>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          placeholder="username"
          {...register('username', {
            required: 'This is required',
            minLength: {value: 3, message: 'Minimum length should be 3'},
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

      {/* <!-- Age - TODO: change to birth date--> */}
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
          {(errors.birthdate && (
            <span data-testid="birthdate-error-required" role="alert">
              {errors.birthdate.message}
            </span>
          )) ||
            (errors.birthdate && errors.birthdate.type === 'validate' && (
              <span data-testid="birthdate-error-age" role="alert">
                You must be older than 18 (this year)
              </span>
            ))}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          type="password"
          data-testid="password"
          id="password"
          placeholder="password"
          {...register('password', {
            required: 'This is required',
            minLength: {value: 5, message: 'Minimum length should be 5'},
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
      <FormControl isInvalid={!!errors.confirmPassword}>
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <Input
          type="password"
          id="confirmPassword"
          data-testid="confirmPassword"
          placeholder="confirmPassword"
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
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};
export default RegisterForm;
