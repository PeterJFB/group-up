import {Flex, Box, Image} from '@chakra-ui/react';
import React from 'react';
import {GroupObject} from '../../api/types';

type Props = {
  members: GroupObject['members'];
};

export const MembersNumber: React.FC<Props> = ({members}) => {
  return (
    <Flex
      w={'56px'}
      h={'30px'}
      boxShadow={'md'}
      border="2px"
      borderColor={'groupGreen'}
      borderRadius={'10px'}
      alignItems={'center'}
      justifyContent="center"
    >
      <Box flex={1} ml="5px" textAlign="center">
        {members.length}
      </Box>

      <Image
        src={`${process.env.PUBLIC_URL}/images/ProfileIcon.svg`}
        maxW="20px"
        maxH="20px"
        mr="5px"
      />
    </Flex>
  );
};

export default MembersNumber;
