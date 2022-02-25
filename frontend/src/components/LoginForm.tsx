import {useForm} from 'react-hook-form';
import React, {useState} from 'react';

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';

type LoginUserObject = {
  email: string;
  password: string;
};

type LoginFormProps = {
  signInAndGetStatus: (email: string, password: string) => Promise<number>;
};

const LoginForm: React.FC<LoginFormProps> = ({signInAndGetStatus}) => {
  /**
   * Login form using email and password
   * when submit is pressed, a login request is sent and if login is succesful,
   * the user should be redirected to the home page
   */
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<LoginUserObject>();

  const [wrongPassword, setWrongPassword] = useState(false);

  const onSubmit = async (values: LoginUserObject) => {
    const status = await signInAndGetStatus(values.email, values.password);
    console.log('STATUS', status);
    if (status != 200) {
      setWrongPassword(true);
    } else {
      //TODO: route to home screen
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          placeholder="example@gmail.com"
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

      <FormControl isInvalid={!!errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          type="password"
          data-testid="password"
          id="password"
          placeholder="password"
          {...register('password', {
            required: 'This is required',
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
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Log in
      </Button>
      {wrongPassword && (
        <span role="alert" data-testid="wrongPassword-error">
          Wrong email or password
        </span>
      )}
    </form>
  );
};
export default LoginForm;
