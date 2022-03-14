import {CloseIcon} from '@chakra-ui/icons';
import {Flex} from '@chakra-ui/react';
import React from 'react';
import {UseFormGetValues, UseFormSetValue} from 'react-hook-form';
import {InterestGroupFilter} from './Filter';

const InterestButton: React.FC<{
  getValues: UseFormGetValues<InterestGroupFilter>;
  setValue: UseFormSetValue<InterestGroupFilter>;
}> = ({children, getValues, setValue}) => (
  <Flex
    align="center"
    bgColor="groupWhite.200"
    borderRadius="10px"
    p="0px 10px"
    boxShadow="md"
    h="28px"
    cursor={'pointer'}
    onClick={() => {
      setValue(
        'interests',
        getValues('interests')?.filter(interest => interest != children)
      );
    }}
  >
    <CloseIcon w={2} h={2} mr={1} /> {children}
  </Flex>
);

export default InterestButton;
