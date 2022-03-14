import {Flex, Input} from '@chakra-ui/react';
import React from 'react';
import {UseFormGetValues, UseFormSetValue} from 'react-hook-form';
import {InterestGroupFilter} from './Filter';

const AddInterest: React.FC<{
  getValues: UseFormGetValues<InterestGroupFilter>;
  setValue: UseFormSetValue<InterestGroupFilter>;
}> = ({getValues, setValue}) => {
  const addInterest: React.FocusEventHandler<HTMLInputElement> = e => {
    const {value} = e.target;
    e.target.value = '';
    if (!value) return;

    const interests = getValues('interests');
    if (!interests) {
      setValue('interests', [value]);
      return;
    }
    if (!interests.includes(value)) {
      setValue('interests', [...interests, value]);
    }
  };
  return (
    <Flex
      align="center"
      bgColor="groupWhite.200"
      borderRadius="10px"
      p="0px 10px"
      boxShadow="md"
      h="28px"
      width={'auto'}
    >
      +
      <Input
        as={'input'}
        p="0px 10px"
        h="inherit"
        w={'40px'}
        border={''}
        placeholder="..."
        transition="width 0.5s"
        onBlur={addInterest}
        _focus={{width: '80px'}}
      />
    </Flex>
  );
};

export default AddInterest;
