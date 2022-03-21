import {Box} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import {fetchWithToken, signInAndSaveToken} from '../../api/api';
import {useRerender} from '../../utils/hooks';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

export const LoginProvider: React.FC = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [listener, rerender] = useRerender();

  useEffect(() => {
    // Using an IIFE
    fetchWithToken('/auth/validateToken/', 'GET').then(response => {
      if (response.missingToken || response.status != 200) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    });
  }, [listener]);

  return (
    <>
      {!loggedIn ? (
        <Box flex={1} overflow="auto">
          <Routes>
            <Route
              path="/register"
              element={<RegisterForm rerender={rerender} />}
            />
            <Route
              path="/*"
              element={
                <LoginForm
                  rerender={rerender}
                  signInAndGetStatus={signInAndSaveToken}
                />
              }
            />
          </Routes>
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
