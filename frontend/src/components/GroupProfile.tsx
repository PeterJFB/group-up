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
  Spacer,
} from '@chakra-ui/react';
import {fetchWithToken} from '../api/api';
import {GroupType} from '../types/api';
import {useParams} from 'react-router-dom';
import {InterestItem} from './Groups';

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

const GroupProfile: React.FC = () => {
  const {id} = useParams();
  const [groupDetails, setGroupDetails] = useState<GroupType>();
  const [ageDetails, setAgeDetails] = useState<string[]>();

  useEffect(() => {
    if (!id) {
      console.log(id);
      return;
    }
    fetchGroupInfo(parseInt(id))
      .then(resp => setGroupDetails(resp))
      .catch(err => console.log(err));
    fetchGroupAges(parseInt(id))
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
    if (ages[0] == ages[ages.length - 1]) {
      return agesSorted[0] + ' y.o.';
    } else {
      return (
        agesSorted[0] + ' y.o. - ' + agesSorted[agesSorted.length - 1] + ' y.o.'
      );
    }
  }

  if (groupDetails == undefined || ageDetails == undefined)
    return <Container>Loading...</Container>;

  return (
    <Container maxW="container.lg.xl" p={0}>
      <Flex h="80vh" py={20} bg="groupWhite.200">
        <VStack
          w="full"
          // h="full"
          // p={10}
        >
          <HStack w="full">
            <Spacer />
            <VStack spacing="10px">
              <Box>
                <Image
                  borderRadius="full"
                  boxShadow="xl"
                  w="150px"
                  src={process.env.PUBLIC_URL + '/images/groupImage2.png'}
                />
                {/* TODO: SPRINT 2: Personol profile picture */}
              </Box>
              <Heading w={'300px'} size="lg" color="black" textAlign={'center'}>
                {groupDetails.name}
              </Heading>
            </VStack>
            <Spacer />
            
          </HStack>

          {/* MEMBER COUNT, AGE RANGE AND LOCATION */}
          <Flex w="full" mb="15px">
          {/* <HStack w="full"> */}
            <Spacer />
            <Box
              border="1px"
              borderColor="groupGreen"
              rounded="md"
              boxShadow="sm"
              // mt="20px"
              color="black"
            >
              <Flex h={'26px'}>
                <Box marginLeft={'8px'} marginRight={'4px'}>
                  <Text fontSize={'lg'} fontWeight={'bold'}>{groupDetails.members.length}</Text>
                </Box>
                <Box>
                  <Image
                    src={`${process.env.PUBLIC_URL}/images/ProfileIcon.svg`}
                    w={'24px'}
                    position={'relative'}
                    right={'0px'}
                    top={'2px'}
                  />
                </Box>
              </Flex>
            </Box>
            <Spacer />
            <Box >
                <Text fontSize={'20px'} textAlign={'center'}>
                  Ages: {ageGap(ageDetails)}
                </Text>
                {/*TODO: Replace text object above with multi-line text object containing ages, time and rating. */}
            </Box>
            <Spacer />
            <Box 
              // ml="23px" 
              // pt="23px" 
              flex={1} 
              color="black"
            >
              <HStack>
                <Image
                  w="24px"
                  src={process.env.PUBLIC_URL + '/images/locationIcon.svg'}
                />
                <Text fontSize="20px">{groupDetails.location}</Text>
              </HStack>
            </Box>
            <Spacer />
          {/* </HStack> */}
          </Flex>
          <Flex pt="5">
          {groupDetails.interests.map((interest, index) => {
            return <InterestItem key={index.toString()} interest={interest} />;
            //TODO: Add max length to interest fields to avoid overflow
            //TODO: In case of overflow, show as many as will fit, then [+N] as the last field to show they have N more interests
          })}
        </Flex>

          {/* QUOTE AND DESCRIPTION */}
          <VStack py="20px"  maxW={'70vw'}>
            <Box>
              <Text fontStyle={'italic'} fontSize="20px" color="black" textAlign={'center'}>
                {groupDetails.quote}
              </Text>
            </Box>
            <Box pt="30px">
              <Text fontSize="20px" color="black" textAlign={'center'}>
                {groupDetails.description}
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default GroupProfile;
