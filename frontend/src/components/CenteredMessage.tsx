import {Flex} from '@chakra-ui/react';
import React from 'react';

const CenteredMessage: React.FC = ({children}) => {
  return (
    <Flex
      direction={'column'}
      justify="center"
      align="center"
      height="100%"
      width="100%"
      textAlign={'center'}
      p="20px"
    >
      {children}
    </Flex>
  );
};

export default CenteredMessage;
