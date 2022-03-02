import {VStack} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {
  fetchWithToken,
  registerAndSaveToken,
  signInAndSaveToken,
} from '../../api/api';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

export const LoginProvider: React.FC = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Using an IIFE
    fetchWithToken('/auth/validateToken/', 'GET').then(response => {
      if (response.missingToken || response.status != 200) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    });
  }, []);

  return (
    <>
      {!loggedIn ? (
        <VStack>
          <Routes>
            <Route
              path="/register"
              element={
                <RegisterForm
                  registerAndGetStatus={registerAndSaveToken}
                  navigate={navigate}
                />
              }
            />
            <Route
              path="/*"
              element={
                <LoginForm
                  navigate={navigate}
                  signInAndGetStatus={signInAndSaveToken}
                />
              }
            />
          </Routes>
        </VStack>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
