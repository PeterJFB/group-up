import {useForm} from 'react-hook-form';
import React, {useEffect} from 'react';
import {Link as RouteLink, useNavigate} from 'react-router-dom';

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  HStack,
  Link,
  Flex,
  Box,
  Container,
} from '@chakra-ui/react';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType, rbState} from '../state';

type LoginUserObject = {
  email: string;
  password: string;
};

type LoginFormProps = {
  rerender: () => void;
  signInAndGetStatus: (email: string, password: string) => Promise<number>;
};

const LoginForm: React.FC<LoginFormProps> = ({
  rerender,
  signInAndGetStatus,
}) => {
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

  const setRbState = useSetRecoilState(rbState);
  const navigate = useNavigate();
  const setAlertState = useSetRecoilState(alertState);

  useEffect(() => {
    setRbState([
      false,
      () => {
        return;
      },
    ]);
  }, []);

  const onSubmit = async (values: LoginUserObject) => {
    const status = await signInAndGetStatus(
      values.email,
      values.password
    ).catch(() => {
      return -1;
    });
    if (status != 200 && status != 201) {
      if (status === 400) {
        setAlertState({
          type: AlertType.ERROR,
          message:
            'Could not log in. Email or password was incorrect. Please try again.',
          active: true,
        });
      } else {
        setAlertState({
          type: AlertType.ERROR,
          message:
            'Could not log in because of unexpected server error. Please try again later.',
          active: true,
        });
      }
      console.log(status);
    } else {
      rerender();
    }
  };

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex px={10} py={2}>
        <Box py={'10'}>
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
            <Box py={'3'}>
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
            </Box>
            <HStack spacing={'50px'}>
              <Box py={'2'}>
                <Button
                  mt={4}
                  colorScheme="teal"
                  bg="groupGreen"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Log in
                </Button>
              </Box>
              <br></br>
              <Box py={'2'}>
                <Link
                  as={RouteLink}
                  to="/register"
                  onClick={() => {
                    setRbState([
                      true,
                      () => {
                        navigate('/');
                      },
                    ]);
                  }}
                >
                  <Button mt={4} colorScheme="teal" bg="groupGreen">
                    Sign Up
                  </Button>
                </Link>
              </Box>
            </HStack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
};
export default LoginForm;
