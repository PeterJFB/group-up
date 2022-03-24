import {Button, Flex, Heading, Image, Spacer, VStack} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {singOutAndDeleteToken} from '../api/api';
import {checkLoginState, goldState} from '../state';
import {UserObject} from '../types/api';
import CenteredMessage from './CenteredMessage';
import {getStoredUser} from './GroupProfile/api';

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserObject | undefined>(undefined);

  const [gs, setGs] = useRecoilState(goldState);
  const clState = useSetRecoilState(checkLoginState);

  const toggleGold = () => {
    setGs({active: !gs.active});
  };

  const signOut = () => {
    singOutAndDeleteToken();
    clState(prev => ({toggle: !prev}));
  };

  useEffect(() => {
    setUser(getStoredUser());
    console.log(user);
    setIsLoading(false);
  }, []);
  return (
    <Flex
      flexDir="column"
      flex={1}
      height="100%"
      width="100%"
      bg="groupWhite.200"
      py={10}
      align="center"
    >
      {!isLoading ? (
        user ? (
          <>
            <VStack spacing="10px">
              <Flex justify="center">
                <Image
                  objectFit={'cover'}
                  boxShadow="xl"
                  borderRadius={'full'}
                  w="150px"
                  src={process.env.PUBLIC_URL + '/images/UserImage.svg'}
                />
                {/* TODO: SPRINT 2: Personal profile picture */}
              </Flex>
              <Heading w={'300px'} size="lg" color="black" textAlign={'center'}>
                {user?.first_name} {user?.last_name}
              </Heading>
            </VStack>
            <Spacer />

            <Button
              bg={gs.active ? 'groupGold' : 'groupWhite.200'}
              _hover={{opacity: '80%'}}
              shadow="xl"
              w="200px"
              onClick={toggleGold}
              color="groupGreen"
              mt="5"
            >
              {gs.active ? 'Deactivate' : 'Acivate'} GroupUp Gold
            </Button>

            <Button
              bg="groupGreen"
              w="200px"
              onClick={signOut}
              textColor="groupWhite.200"
              mt="5"
            >
              Sign out
            </Button>
          </>
        ) : (
          <CenteredMessage>
            Could not find profile. Please log out and attempt again.
            <Button
              bg="groupGreen"
              w="200px"
              onClick={signOut}
              textColor="groupWhite.200"
              mt="5"
            >
              Sign out
            </Button>
          </CenteredMessage>
        )
      ) : (
        <CenteredMessage>Loading</CenteredMessage>
      )}
    </Flex>
  );
};

export default UserProfile;
