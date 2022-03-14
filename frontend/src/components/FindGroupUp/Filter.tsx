import {
  Search2Icon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, {KeyboardEventHandler, useRef, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {GroupObject} from '../../api/types';
import AddInterest from './AddInterest';
import InterestButton from './InterestButton';

export type InterestGroupFilter = {
  interests?: string[];
  location?: string;
  meetingDate?: string;
  ageMin?: number;
  ageMax?: number;
  groupId: number;
};

export type FilterProps = {
  onSubmit: SubmitHandler<InterestGroupFilter>;
};

export const Filter: React.FC<
  FilterProps & {
    setGroupOptions: React.Dispatch<
      React.SetStateAction<GroupObject[] | undefined>
    >;
  }
> = ({onSubmit}) => {
  const [expanded, setExpanded] = useState(false);

  const gRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    formState: {errors},
  } = useForm<InterestGroupFilter>({defaultValues: {interests: []}});

  // Tell useForm to update fields whenever "interests" change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchInterestFields = watch('interests');

  const checkKeyDown: KeyboardEventHandler<
    HTMLDivElement & HTMLFormElement
  > = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const selectedInterests = getValues('interests');
  // console.log(getValues());

  const GridFormItem: React.FC<{
    displayName: string;
    transparent?: boolean;
  }> = ({displayName, children, transparent}) => (
    <>
      <GridItem as={Flex} justify={'flex-end'} align={'center'}>
        <Box textAlign={'right'}>{displayName}</Box>
      </GridItem>
      <GridItem>
        <Flex
          align="center"
          bgColor={transparent ? 'none' : 'groupWhite.200'}
          borderRadius="10px"
          w={'fit-content'}
          maxW={300}
        >
          {children}
        </Flex>
      </GridItem>
    </>
  );

  return (
    <>
      <Box
        as="form"
        onSubmit={handleSubmit(async e => {
          await onSubmit(e);
          setExpanded(false);
        })}
        onKeyDown={checkKeyDown}
        h={expanded ? `${gRef.current?.clientHeight}px` : 0}
        transition="height 0.3s"
        overflow="hidden"
        bgColor="groupWhite.100"
        shadow="inner"
      >
        <Grid templateColumns={'auto 1fr'} ref={gRef} p="10px 20px" gap={'7px'}>
          {/* Interests */}
          <GridFormItem displayName="Interests:" transparent>
            <HStack justify={'start'} flexWrap="wrap" rowGap={1}>
              {selectedInterests &&
                selectedInterests.map(interest => (
                  <InterestButton
                    key={interest}
                    getValues={getValues}
                    setValue={setValue}
                  >
                    {interest}
                  </InterestButton>
                ))}
              <AddInterest getValues={getValues} setValue={setValue} />
            </HStack>
          </GridFormItem>

          {/* Location */}
          <GridFormItem displayName="Location:">
            <InputGroup>
              <InputLeftElement h="100%">
                <Search2Icon />
              </InputLeftElement>
              <Input
                border={''}
                h="28px"
                {...register('location')}
                placeholder="Tønsberg"
                role="location"
              />
            </InputGroup>
          </GridFormItem>

          {/* Meeting date */}
          <GridFormItem displayName="Meetingdate:">
            <InputGroup>
              <InputLeftElement h="100%">
                <CalendarIcon as="label" name="date" />
              </InputLeftElement>
              <Input
                type={'date'}
                min={new Date().toISOString().split('T')[0]}
                border={''}
                h="28px"
                {...register('meetingDate')}
              />
            </InputGroup>
          </GridFormItem>

          {/* Age */}
          <GridFormItem displayName="Age:" transparent>
            <Flex
              align="center"
              bgColor="groupWhite.200"
              borderRadius="10px"
              h="28px"
            >
              <NumberInput>
                <InputLeftElement h="100%">
                  <Box>Fr:</Box>
                </InputLeftElement>
                <NumberInputField
                  type="number"
                  bgColor="groupWhite.200"
                  borderRadius="10px"
                  border=""
                  pr="5px"
                  pl="40px"
                  h="28px"
                  w="80px"
                  {...register('ageMin', {
                    onBlur: event => {
                      const ageMin = event.target.value;
                      if (ageMin < 18) return setValue('ageMin', 18);
                      const ageMax = getValues('ageMax');
                      if (ageMax && ageMin > ageMax) {
                        return setValue('ageMin', ageMax);
                      }
                      if (ageMin > 123) return setValue('ageMin', 123);
                    },
                  })}
                />
              </NumberInput>
            </Flex>
            <Spacer w={'5px'} />
            <Flex
              align="center"
              bgColor="groupWhite.200"
              borderRadius="10px"
              h="28px"
            >
              <NumberInput>
                <InputLeftElement h="100%">
                  <Box>To:</Box>
                </InputLeftElement>
                <NumberInputField
                  type="number"
                  bgColor="groupWhite.200"
                  borderRadius="10px"
                  border=""
                  pr="5px"
                  pl="40px"
                  h="28px"
                  w="80px"
                  {...register('ageMax', {
                    onBlur: event => {
                      const ageMax = event.target.value;
                      if (ageMax > 123) return setValue('ageMax', 123);
                      const ageMin = getValues('ageMin');
                      if (ageMin && ageMax < ageMin) {
                        return setValue('ageMax', ageMin);
                      }
                      if (ageMax < 18) return setValue('ageMax', 18);
                    },
                  })}
                />
              </NumberInput>
            </Flex>
          </GridFormItem>

          {/* Submit */}
          <GridItem colSpan={2} display="flex" justifyContent={'center'}>
            <Button
              bgColor="groupGreen"
              color={'groupWhite.200'}
              borderRadius="10px"
              p="5px 10px"
              mt="5px"
              shadow={'md'}
              type="submit"
              role="submit"
            >
              Find GroupUps
            </Button>
            <FormErrorMessage>
              {errors.ageMin && (
                <span data-testid="name-error" role="alert">
                  {errors.ageMin.message}
                  {console.log(errors.ageMin.message)}
                </span>
              )}
            </FormErrorMessage>
          </GridItem>
        </Grid>
      </Box>
      <Flex
        cursor={'pointer'}
        align="center"
        h={'40px'}
        onClick={() => {
          setExpanded(!expanded);
        }}
        shadow={expanded ? '2xl' : 'inner'}
        bgColor="groupWhite.200"
      >
        <Text align={'center'} flex={1} pl={4}>
          Adjust filter
        </Text>
        {expanded ? (
          <ChevronUpIcon w={10} h={10} position="absolute" right={0} />
        ) : (
          <ChevronDownIcon w={10} h={10} position="absolute" right={0} />
        )}
      </Flex>
    </>
  );
};
