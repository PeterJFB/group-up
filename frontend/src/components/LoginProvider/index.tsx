import {Box, Button, VStack} from '@chakra-ui/react';
import React, {useState} from 'react';

export const LoginProvider: React.FC = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Box>
      {!loggedIn ? (
        <VStack>
          <Box>Du er ikke logget inn</Box>
          <Button
            onClick={() => {
              setLoggedIn(true);
            }}
          >
            Log in
          </Button>
        </VStack>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};
