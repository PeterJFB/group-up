import {Link, VStack, HStack, Text, Heading, Image} from '@chakra-ui/react';
import React from 'react';
import {Link as RouteLink} from 'react-router-dom';
import {GroupUpObject} from '../../types/api';

type StatusItemProps = {
  color?: string;
  children: string;
};

const StatusItem: React.FC<StatusItemProps> = ({color, children}) => {
  return (
    <>
      <HStack
        h={'32px'}
        w={'100%'}
        bgColor={color}
        borderBottomRadius={'8px'}
        justifyContent={'center'}
      >
        <Text size={'md'} color="white">
          {children}
        </Text>
      </HStack>
    </>
  );
};

export const GroupUpListItem: React.FC<{
  groupUp: GroupUpObject;
}> = ({groupUp}) => {
  const {group1, group2, plannedDate} = groupUp;

  const meetingDateText =
    plannedDate && Date.now() < Date.parse(plannedDate)
      ? `Meeting date: ${plannedDate}`
      : undefined;

  return (
    <Link
      as={RouteLink}
      to={`/groupups/${groupUp.id}`}
      _hover={{textDecoration: 'none'}}
      role="groupUpListItem"
    >
      <VStack
        m={'5'}
        shadow={'xl'}
        border={groupUp.isSuperGroupup ? '2px solid' : 'none'}
        borderRadius={'10px'}
        borderColor={groupUp.isSuperGroupup ? 'groupGold' : 'none'}
        bgColor={'groupWhite.200'}
        _hover={{cursor: 'pointer'}}
        pos="relative"
      >
        <VStack w="100%" justify={'space-between'} pl={'2'}>
          <HStack justify={'start'} width={'100%'} mt={'2'}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/groupImage.png`}
              minW={'30px'}
              maxW={'30px'}
              minH={'30px'}
              maxH={'30px'}
            />
            <Heading size={'sm'}>{group1.name}</Heading>
            {groupUp.isSuperGroupup && (
              <Image
                src={`${process.env.PUBLIC_URL}/images/groupupGold.svg`}
                pos="absolute"
                right="10px"
                top="5px"
                maxH="35px"
              />
            )}
          </HStack>
          <HStack justify={'start'} width={'100%'} mt={'2'} pb={'1'}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/groupImage3.png`}
              minW={'30px'}
              maxW={'30px'}
              minH={'30px'}
              maxH={'30px'}
            />
            <Heading size={'sm'}>{group2.name}</Heading>
          </HStack>
        </VStack>
        {meetingDateText && (
          <StatusItem color={'groupGreen'}>{meetingDateText}</StatusItem>
        )}
      </VStack>
    </Link>
  );
};
