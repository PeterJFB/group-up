import {Flex} from '@chakra-ui/react';
import React from 'react';
import {Interest} from '../../types/api';

export type InterestItemProps = {
  interest: Interest;
};

export const InterestItem: React.FC<InterestItemProps> = ({interest}) => {
  return (
    <Flex
      align="center"
      bgColor="groupWhite.200"
      borderRadius="10px"
      p="0px 10px"
      borderWidth="2px"
      borderColor="groupGreen"
      h="28px"
    >
      {interest.name}
    </Flex>
  );
};

export default InterestItem;
