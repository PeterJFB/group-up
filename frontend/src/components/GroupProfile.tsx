import React, {useState, useEffect} from 'react';
import {
  Container,
  Text,
  Flex,
  VStack,
  Heading,
  HStack,
  Image,
  Box,
  Center,
} from '@chakra-ui/react';
import {fetchWithToken} from '../api/api';
import {GroupType} from '../types/api';

type GroupProfileProps = {
  id: number;
};

async function fetchGroupInfo(id: number) {
  const response = await fetchWithToken<GroupType>(`/api/groups/${id}`, 'GET');
  if (!response.missingToken) return response.body;
  else return;
}

async function fetchGroupAges(id: number) {
  const response = await fetchWithToken<string[]>(
    `/api/groups/${id}/getAges`,
    'GET'
  );
  if (!response.missingToken) return response.body;
  else return;
}

const GroupProfile: React.FC<GroupProfileProps> = ({id}: GroupProfileProps) => {
  const [groupDetails, setGroupDetails] = useState<GroupType>();
  const [ageDetails, setAgeDetails] = useState<string[]>();

  useEffect(() => {
    fetchGroupInfo(id)
      .then(resp => setGroupDetails(resp))
      .catch(err => console.log(err));
    fetchGroupAges(id)
      .then(resp => setAgeDetails(resp))
      .catch(err => console.log(err));
  }, []);

  function findAges(ages: string[]) {
    const listAge = ages.map(age => {
      return new Date().getFullYear() - new Date(age).getFullYear();
    });
    const listAgeSorted = listAge.sort((n1, n2) => n1 - n2);
    return listAgeSorted;
  }

  function ageGap(ages: string[]) {
    const agesSorted = findAges(ages);
    if (ages.length == 1 || ages[0] == ages[ages.length - 1]) {
      return agesSorted[0] + ' år';
    } else {
      return (
        agesSorted[0] + ' år - ' + agesSorted[agesSorted.length - 1] + ' år'
      );
    }
  }

  if (groupDetails == undefined || ageDetails == undefined)
    return <Container>Loading...</Container>;

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex h="100vh" py={20}>
        <VStack
          w="full"
          h="full"
          p={10}
          alignItems="flex-start"
          bg="groupWhite.100"
        >
          <HStack w="full">
            <Box flex={1} color="groupWhite.100" />

            <VStack flex={1} spacing="10px" alignItems="flex-start">
              <Box flex={1}>
                <Image
                  borderRadius="full"
                  boxShadow="xl"
                  src={process.env.PUBLIC_URL + '/images/groupImage2.png'}
                />
                {/**SPRINT 2: Personol profile picture */}
              </Box>

              <Heading size="lg" color="black">
                {groupDetails.name}
              </Heading>
            </VStack>
            <Box flex={1} color="groupWhite.100" />
          </HStack>
          <HStack w="full">
            <Box
              border="1px"
              borderColor="groupGreen"
              rounded="md"
              boxShadow="sm"
              mt="20px"
              color="black"
            >
              <HStack>
                <Box />
                <Text fontSize="20px">{groupDetails.members.length}</Text>
                <Image
                  w="19px"
                  height="20px"
                  src={process.env.PUBLIC_URL + '/images/membersIcon.png'}
                />

                <Box />
              </HStack>
            </Box>
            <VStack flex={1} spacing="5px">
              <Box flex={1} color="groupWhite.100" />
              <Center fontSize="20px" color="black">
                {' '}
                {/**Får ikke til sentrering */}
                Alder: {ageGap(ageDetails)}
              </Center>

              {/*TODO: 
              <Text size="14px" color="black">
               Tid: 
              </Text>
                time-variable from Group Object
                SPRINT 2
              */}

              {/**
              <Text pt="3px" color="black">
                Review S2
              </Text> 
              TODO: SPRINT 2 */}
            </VStack>
            <Box ml="23px" pt="23px" flex={1} color="black">
              <HStack>
                <Image
                  w="20px"
                  height="20px"
                  src={process.env.PUBLIC_URL + '/images/locationIcon.png'}
                />
                <Text fontSize="20px">{groupDetails.location}</Text>
              </HStack>
            </Box>
          </HStack>
          <HStack w="full">
            <Box flex={1} color="groupWhite.100" />

            <VStack spacing="1px">
              <Box flex={1} color="groupWhite.100" />
              <Box
                border="1px"
                borderColor="groupGreen"
                boxShadow="sm"
                rounded="md"
                color="black"
                flex={1}
              >
                {groupDetails.interests.map(interest => (
                  <Box key={interest.name}>{interest.name}</Box>
                ))}
              </Box>
            </VStack>

            <Box flex={1} color="groupWhite.100" />
          </HStack>

          <VStack>
            <Text fontSize="20px" pt="17px" color="black">
              {groupDetails.quote}
            </Text>

            <Center pt="20px" fontSize="20px" color="black">
              {' '}
              {/**Får ikke til sentrering */}
              {groupDetails.description}
            </Center>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default GroupProfile;
