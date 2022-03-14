import React from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import {Link as RouteLink} from 'react-router-dom';
import {GroupObject} from '../api/types';
import InterestItem from './GroupProfile/InterestItem';
import MembersNumber from './GroupProfile/MembersNumber';

export type GroupListItemProps = {
  group: GroupObject;
};

export const GroupListItem: React.FC<
  GroupListItemProps & {
    to?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  }
> = ({group, to, onClick}) => {
  const {name, quote, members, interests} = group;
  return (
    <Link
      as={RouteLink}
      to={to ?? ''}
      _hover={{textDecoration: 'none'}}
      role="groupListItem"
    >
      <VStack
        m={5}
        shadow={'xl'}
        borderRadius="10px"
        bgColor="groupWhite.200"
        onClick={onClick}
        _hover={{cursor: 'pointer'}}
      >
        <HStack w="100%" justify={'space-between'}>
          <HStack justify={'start'} ml={2} mt={2} w="100%">
            <Image
              src={`${process.env.PUBLIC_URL}/images/groupImage.png`}
              minW={'40px'}
              maxW={'40px'}
              minH={'40px'}
              maxH={'40px'}
            />
            <Heading size={'md'}>{name}</Heading>
          </HStack>
          <Box pr="10px">
            <MembersNumber members={members} />
          </Box>
        </HStack>
        <Text w="100%" as={'i'} p="0 10px" textAlign={'left'}>
          {quote}
        </Text>
        <HStack justify="left" width="full" p={2} pt="0">
          <Flex wrap={'wrap'} gap="4px">
            {interests.map(interest => {
              return <InterestItem key={interest.name} interest={interest} />;
            })}
          </Flex>
        </HStack>
      </VStack>
    </Link>
  );
};
